<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import Header from './SendHeader.vue'
import WalletConnectionBanner from './WalletConnectionBanner.vue'
import BalanceCard from './BalanceCard.vue'
import TransferForm from './TransferForm.vue'
import TransferInfoCard from './TransferInfoCard.vue'
import RecentTransfers from './RecentTransfers.vue'
import QuickActions from './QuickActions.vue'
import AddressBookDialog from './AddressBookDialog.vue'
import AddContactDialog from './AddContactDialog.vue'
import PreviewTransferDialog from './PreviewTransferDialog.vue'
import LoadingDialog from './LoadingDialog.vue'
import SuccessDialog from './SuccessDialog.vue'
import { useConfig, useConnection } from '@wagmi/vue'
import { useChain } from '@/app/composables/useChain'
import { wancashAbi, wancashContractAddress } from '@/app/services/contracts'
import { watchDebounced } from '@vueuse/core'
import { readContract, writeContract, waitForTransactionReceipt, getBalance } from '@wagmi/core'
import { parseEther, type Hash } from 'viem'
import { addressBookService, type Contact } from '../services/addressBook'
import { transactionHistoryService } from '@/app/services/transactionHistoryService'
import { formatTokenBalance } from '@/utils/format'
import { usePriceStore } from '@/stores/priceStore'
import { storeToRefs } from 'pinia'

const priceStore = usePriceStore()
const { wchPrice: tokenPrice } = storeToRefs(priceStore)

const { isConnected, address: walletAddress, chainId } = useConnection()
const { getChainInfo } = useChain()
const config = useConfig()
const contractAddress = computed(() => {
  if (!chainId.value) return null
  return wancashContractAddress[chainId.value] ?? '0x03A71968491d55603FFe1b11A9e23eF013f75bCF'
})

// State balance
const rawBalance = ref<bigint | null>(null)
const balanceLoading = ref(true)
const balanceError = ref(false)

// Native coin balance
const nativeBalance = ref<number>(0)
const nativeBalanceLoading = ref(true)

// Get current chain info for native currency symbol
const currentChainInfo = computed(() => getChainInfo(chainId.value || 0))
const nativeCurrencySymbol = computed(() => currentChainInfo.value?.symbol || 'ETH')

// Manual control query key
const queryKey = computed(() => [
  'balanceOf',
  contractAddress.value,
  walletAddress.value,
])

watchDebounced(
  queryKey,
  async ([, contract, address]) => {
    if (!isConnected.value || !address || !contract) {
      rawBalance.value = null
      balanceLoading.value = false
      return
    }

    balanceLoading.value = true
    balanceError.value = false

    try {
      const balance = await readContract(config, {
        address: contract as `0x${string}`,
        abi: wancashAbi.abi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      })

      rawBalance.value = balance as bigint
    } catch (err) {
      console.error('Balance fetch error:', err)
      balanceError.value = true
    } finally {
      balanceLoading.value = false
    }
  },
  { debounce: 300, immediate: true }
)

const refreshBalance = async () => {
  if (!isConnected.value || !walletAddress.value || !contractAddress.value) return
  try {
    balanceLoading.value = true
    const balance = await readContract(config, {
      address: contractAddress.value as `0x${string}`,
      abi: wancashAbi.abi,
      functionName: 'balanceOf',
      args: [walletAddress.value as `0x${string}`],
    })
    rawBalance.value = balance as bigint
  } catch (err) {
    console.error(err)
    balanceError.value = true
  } finally {
    balanceLoading.value = false
  }
}

// Fetch native coin balance (BNB, ETH, etc.)
const fetchNativeBalance = async () => {
  if (!isConnected.value || !walletAddress.value) return
  try {
    nativeBalanceLoading.value = true
    const balance = await getBalance(config, {
      address: walletAddress.value as `0x${string}`,
    })
    nativeBalance.value = Number(balance.formatted)
  } catch (err) {
    console.error('Native balance fetch error:', err)
  } finally {
    nativeBalanceLoading.value = false
  }
}

// Watch for chain changes to update native balance reactively
watch(chainId, () => {
  if (isConnected.value && walletAddress.value) {
    fetchNativeBalance()
  }
})

onMounted(() => {
  refreshBalance()
  fetchNativeBalance()
  priceStore.fetchPrices()
})

// Interfaces (kept for type safety)
interface Transfer { id: number; recipientShort: string; amount: number; time: string; status: string; hash?: string }
interface FormData { recipientAddress: string; amount: string; memo: string }
interface LastTransaction { amount: string; recipientName: string; transactionHash: string; recipientAddress: string; memo: string }

// State
const router = useRouter()
const walletConnected = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const showAddressBook = ref<boolean>(false)
const showAddContact = ref<boolean>(false)
const showPreview = ref<boolean>(false)
const showSuccess = ref<boolean>(false)
const agreeTerms = ref<boolean>(false)
const form = ref<FormData>({ recipientAddress: '', amount: '', memo: '' })
const addressError = ref<string>('')
const amountError = ref<string>('')
const walletBalance = computed(() => {
  if (!rawBalance.value) return 0
  const num = Number(rawBalance.value) / 1e18
  return Number(num.toFixed(4))
})
// Token price is now managed by global store
// const tokenPrice = ref<number>(0.0015)
const recipientName = ref<string>('')
const minimumTransfer = ref<number>(1)
const maxTransferPerTx = ref<number>(5000000)
const dailyLimit = ref<number>(21000000)
const estimatedTime = ref<string>('~15 seconds')
const addressBookSearch = ref<string>('')
const addressBook = ref<Contact[]>([])
const transactionHash = ref<string>('')
const recentTransfers = ref<Transfer[]>([])

const lastTransaction = ref<LastTransaction>({ amount: '', recipientName: '', transactionHash: '', recipientAddress: '', memo: '' })

// Computed
// Gas fee is paid in native coin, not WCH - so maxTransferable is just the wallet balance
const maxTransferable = computed(() => Math.min(walletBalance.value, maxTransferPerTx.value))
const equivalentValue = computed(() => (Number.parseFloat(form.value.amount) || 0) * tokenPrice.value)
const currentNetworkName = computed(() => getChainInfo(chainId.value || 0)?.name || 'Unknown Network')

// Fungsi untuk mengirim token
const sendToken = async (): Promise<Hash | null> => {
  if (!isConnected.value || !walletAddress.value || !contractAddress.value) {
    toast.error('Wallet not connected')
    return null
  }

  if (!form.value.recipientAddress || !form.value.amount) {
    toast.error('Please fill recipient address and amount')
    return null
  }

  // Validasi alamat
  if (!/^0x[a-fA-F0-9]{40}$/.test(form.value.recipientAddress)) {
    toast.error('Invalid recipient address format')
    return null
  }

  let pendingTxId: string | number | null = null

  try {
    const amountInWei = parseEther(form.value.amount)

    console.log('Sending token...')
    // Cek apakah saldo mencukupi
    if (!rawBalance.value || rawBalance.value < amountInWei) {
      toast.error('Insufficient balance')
      return null
    }

    // Create pending transaction record
    const pending = await transactionHistoryService.createPending({
      type: 'send',
      fromAddress: walletAddress.value,
      toAddress: form.value.recipientAddress,
      amount: form.value.amount,
      tokenSymbol: 'WCH',
      fromChainId: chainId.value || 0,
      fromChainName: currentNetworkName.value,
      memo: form.value.memo || undefined,
    })
    pendingTxId = pending.id || pending.localId

    // Kirim transaksi
    const hash = await writeContract(config, {
      address: contractAddress.value as `0x${string}`,
      abi: wancashAbi.abi,
      functionName: 'transfer',
      args: [
        form.value.recipientAddress as `0x${string}`,
        amountInWei
      ],
    })

    toast.info('Transaction submitted! Waiting for confirmation...', {
      duration: 3000
    })

    // Update with hash (still pending confirmation)
    transactionHistoryService.updateLocal(pendingTxId, { hash })

    // Tunggu konfirmasi
    const receipt = await waitForTransactionReceipt(config, {
      hash,
      confirmations: 1
    })

    if (receipt.status === 'success') {
      toast.success('Transfer successful!', {
        description: `${form.value.amount} WCH sent successfully`,
        duration: 5000
      })

      // Mark as success
      await transactionHistoryService.confirmSuccess(pendingTxId, hash)

      // Update balance
      await refreshBalance()

      return hash
    } else {
      toast.error('Transaction failed')
      if (pendingTxId) await transactionHistoryService.markFailed(pendingTxId)
      return null
    }

  } catch (error: unknown) {
    console.error('Send token error:', error)
    if (pendingTxId) await transactionHistoryService.markFailed(pendingTxId)

    if (error instanceof Error) {
      // Handle specific errors
      if (error?.message?.includes('user rejected')) {
        toast.error('Transaction rejected by user')
      } else if (error?.message?.includes('insufficient funds')) {
        toast.error('Insufficient funds for gas')
      } else if (error?.message?.includes('gas')) {
        toast.error('Gas estimation failed')
      } else {
        toast.error(`Transfer failed: ${error?.message || 'Unknown error'}`)
      }
    }

    return null
  }
}

// Methods
const updateForm = (updatedForm: FormData) => { form.value = { ...form.value, ...updatedForm } }

const shortenAddress = (address: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

const validateAddress = () => {
  const address = form.value.recipientAddress.trim()
  if (!address) { addressError.value = ''; recipientName.value = ''; return }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) { addressError.value = 'Invalid wallet address format'; recipientName.value = ''; return }
  const contact = addressBook.value.find(c => c.address.toLowerCase() === address.toLowerCase())
  recipientName.value = contact ? contact.name : ''
  addressError.value = ''
}

const validateAmount = () => {
  const amount = Number.parseFloat(form.value.amount)
  if (!amount || Number.isNaN(amount)) { amountError.value = ''; return }
  if (amount < minimumTransfer.value) amountError.value = `Minimum transfer is ${minimumTransfer.value} WCH`
  else if (amount > maxTransferable.value) amountError.value = `Maximum transfer is ${formatTokenBalance(maxTransferable.value)} WCH`
  else if (amount > walletBalance.value) amountError.value = 'Insufficient balance'
  else amountError.value = ''
}

const setMaxAmount = () => {
  // Standardize to 4 decimal places to avoid standard HTML input issues
  const maxVal = Math.max(0, maxTransferable.value)
  // use regex to truncate to 4 decimals without rounding up, or just use toFixed(4)
  // Usually tokens truncate, but toFixed(4) rounds standardly.
  // Given formatNumber uses toFixed/Intl, let's stick to toFixed(4) for simplicity unless precise truncation is needed.
  // Actually, to avoid "insufficient balance" due to rounding up, we should floor it.
  const factor = 10000
  const truncated = Math.floor(maxVal * factor) / factor
  form.value.amount = truncated.toString()
  validateAmount()
}

const selectContact = (contact: Contact) => {
  form.value.recipientAddress = contact.address
  recipientName.value = contact.name
  showAddressBook.value = false
  validateAddress()
}

const saveContact = (newContactData: Contact) => {
  if (newContactData.name.trim() && newContactData.address.trim()) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(newContactData.address.trim())) {
      toast.error('Invalid wallet address format');
      return
    }

    if (!walletAddress.value) {
      toast.error('Please connect wallet first')
      return;
    }

    // Call backend
    addressBookService.addContact(walletAddress.value, {
      label: newContactData.name,
      wallet: newContactData.address,
      chain_id: chainId.value || 0
    }).then((newContact) => {
      addressBook.value.push(newContact)
      toast.success('Contact added successfully')
      showAddContact.value = false
    }).catch(err => {
      console.error(err)
      toast.error('Failed to save contact')
    })
  }
}

const previewTransfer = () => {
  console.log('Previewing transfer...', isFormValid.value, showPreview.value)
  if (isFormValid.value) showPreview.value = true
  console.log('Previewing transfer...2', isFormValid.value, showPreview.value)
}

const confirmTransfer = async () => {
  showPreview.value = false
  isLoading.value = true

  try {
    // Panggil fungsi sendToken yang sebenarnya
    const hash = await sendToken()

    if (hash) {
      // Update UI dengan transaksi yang sebenarnya
      showSuccess.value = true
      transactionHash.value = hash
      lastTransaction.value = {
        amount: form.value.amount,
        recipientName: recipientName.value,
        transactionHash: hash,
        recipientAddress: form.value.recipientAddress,
        memo: form.value.memo
      }

      const amount = Number.parseFloat(form.value.amount) || 0

      // Tambahkan ke riwayat transaksi UI (optional, since functionality handles history)
      recentTransfers.value.unshift({
        id: Date.now(),
        recipientShort: shortenAddress(form.value.recipientAddress),
        amount,
        time: 'Just now',
        status: 'Successful',
        hash
      })

      // Note: We don't call transactionHistoryService.add here anymore because sendToken handles it.

      // Reset form setelah sukses
      resetForm()
    } else {
      // Jika gagal, form tidak direset agar user bisa coba lagi atau perbaiki
      // resetForm() // Change: Don't reset if failed/cancelled
    }
  } catch (error) {
    console.error('Confirm transfer error:', error)
    toast.error('Transfer confirmation failed')
  } finally {
    isLoading.value = false
  }
}

// Transaction history is now handled by transactionHistoryService

const resetForm = () => {
  form.value = { recipientAddress: '', amount: '', memo: '' }
  agreeTerms.value = false
  addressError.value = ''
  amountError.value = ''
  recipientName.value = ''
  toast.info('Form has been reset')
}

const connectWallet = () => toast.info('Wallet connection feature will be implemented')
const scanQR = () => toast.info('QR scanner feature will be implemented')
const copyOwnAddress = async () => {
  if (!walletAddress.value) {
    toast.error('No wallet address available')
    return
  }

  try {
    await navigator.clipboard.writeText(walletAddress.value)
    toast.success('Address successfully copied to clipboard')
  } catch (error: unknown) {
    console.error('Failed to copy address:', error)
    toast.error('Failed to copy address')
  }
}

const copyTransactionHash = async () => {
  try {
    await navigator.clipboard.writeText(transactionHash.value)
    toast.success('Transaction hash successfully copied')
  } catch (error: unknown) {
    console.error('Failed to copy transaction hash:', error)
    toast.error('Failed to copy transaction hash')
  }
}

const goToPortfolio = () => router.push({ name: 'Portfolio' })
const goToHistory = () => router.push({ name: 'Transaction History' })

const isFormValid = computed(() => {
  console.log('Checking form validity...', form.value.recipientAddress, form.value.amount)
  if (!form.value.recipientAddress || !form.value.amount) return false
  const amount = Number.parseFloat(form.value.amount)
  console.log('Amount:', form.value.recipientAddress.trim() !== '',
    amount >= minimumTransfer.value,
    amount <= maxTransferable.value,
    !addressError.value,
    !amountError.value,
    agreeTerms.value)
  return form.value.recipientAddress.trim() !== '' &&
    amount >= minimumTransfer.value &&
    amount <= maxTransferable.value &&
    !addressError.value &&
    !amountError.value &&
    agreeTerms.value
})

// Fungsi untuk memuat riwayat transaksi dari blockchain (opsional)
const loadTransactionHistory = async () => {
  if (!walletAddress.value) return

  try {
    // Fetch latest from backend (which updates localStorage)
    const history = await transactionHistoryService.fetchFromBackend({ type: 'send' })

    // `shortenAddress` and `Transfer` interface are available in scope
    recentTransfers.value = history.map((tx: any) => ({
      id: tx.id || Date.now(),
      recipientShort: shortenAddress(tx.to),
      amount: tx.amount,
      time: new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(tx.timestamp)),
      status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
      hash: tx.hash
    }))
  } catch (error) {
    console.error('Failed to load transaction history:', error)
  }
}

onMounted(() => {
  if (walletAddress.value) {
    // Get all contacts without chain filter - wallet addresses work across all chains
    addressBookService.getContacts(walletAddress.value).then(contacts => {
      addressBook.value = contacts
    }).catch(console.error)

    // Load transaction history
    loadTransactionHistory()
  }
})


</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <Header @go-to-portfolio="goToPortfolio" />

      <WalletConnectionBanner v-if="!walletConnected" @connect-wallet="connectWallet" />

      <div v-if="walletConnected">
        <BalanceCard :wallet-balance="walletBalance" :token-price="tokenPrice" :native-balance="nativeBalance"
          :native-currency-symbol="nativeCurrencySymbol" @refresh="() => { refreshBalance(); fetchNativeBalance() }" />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <TransferForm :form="form" :minimum-transfer="minimumTransfer" :max-transferable="maxTransferable"
              :estimated-time="estimatedTime" :agree-terms="agreeTerms" :address-error="addressError"
              :amount-error="amountError" :recipient-name="recipientName" :equivalent-value="equivalentValue"
              :is-form-valid="isFormValid" @update:form="updateForm" @update:agree-terms="agreeTerms = $event"
              @validate-address="validateAddress" @validate-amount="validateAmount" @set-max-amount="setMaxAmount"
              @show-address-book="showAddressBook = true" @preview-transfer="previewTransfer" @reset-form="resetForm" />
          </div>

          <div class="space-y-6">
            <TransferInfoCard :minimum-transfer="minimumTransfer" :max-transfer-per-tx="maxTransferPerTx"
              :daily-limit="dailyLimit" :network="currentNetworkName" />
            <RecentTransfers :recent-transfers="recentTransfers" @go-to-history="goToHistory" />
            <QuickActions @scan-qr="scanQR" @show-address-book="showAddressBook = true"
              @copy-own-address="copyOwnAddress" />
          </div>
        </div>
      </div>
    </div>

    <AddressBookDialog :open="showAddressBook" :address-book="addressBook" :address-book-search="addressBookSearch"
      @update:open="showAddressBook = $event" @update:address-book-search="addressBookSearch = $event"
      @select-contact="selectContact" @show-add-contact="showAddContact = true" />

    <AddContactDialog :open="showAddContact" @update:open="showAddContact = $event" @save-contact="saveContact" />

    <PreviewTransferDialog :open="showPreview" :form="form" :recipient-name="recipientName"
      @update:open="showPreview = $event" @confirm-transfer="confirmTransfer" />

    <LoadingDialog :open="isLoading" />

    <SuccessDialog :open="showSuccess" :form="lastTransaction" :recipient-name="lastTransaction.recipientName"
      :transaction-hash="lastTransaction.transactionHash" @update:open="showSuccess = $event"
      @copy-transaction-hash="copyTransactionHash" @go-to-history="goToHistory" />
  </div>
</template>
