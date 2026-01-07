<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
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
import { wancashAbi, wancashContractAddress } from '@/app/services/contracts'
import { watchDebounced } from '@vueuse/core'
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { parseEther, type Hash } from 'viem'

const { isConnected, address: walletAddress, chainId } = useConnection()
const config = useConfig()
const contractAddress = computed(() => {
  if (!chainId.value) return null
  return wancashContractAddress[chainId.value] ?? '0x03A71968491d55603FFe1b11A9e23eF013f75bCF'
})

// State balance
const rawBalance = ref<bigint | null>(null)
const balanceLoading = ref(true)
const balanceError = ref(false)

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

onMounted(() => {
  refreshBalance()
})

// Interfaces (kept for type safety)
interface Contact { name: string; address: string }
interface Transfer { id: number; recipientShort: string; amount: number; time: string; status: string; hash?: string }
interface FormData { recipientAddress: string; amount: string; memo: string }

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
const tokenPrice = ref<number>(0.0015)
const recipientName = ref<string>('')
const minimumTransfer = ref<number>(1)
const maxTransferPerTx = ref<number>(5000000)
const dailyLimit = ref<number>(21000000)
const networkFee = ref<number>(0.01)
const estimatedTime = ref<string>('~15 seconds')
const addressBookSearch = ref<string>('')
const addressBook = ref<Contact[]>([
  { name: 'Budi Santoso', address: '0x742d35Cc6634C0532925a3b844Bc9e0E3F2e0a1b' },
  { name: 'Sari Wijaya', address: '0x98dC8d7b0E3B5F5c5F5C5F5C5F5C5F5C5F5C5F5C' },
  { name: 'PT Gold Invest', address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE' },
])
const transactionHash = ref<string>('')
const recentTransfers = ref<Transfer[]>([
  { id: 1, recipientShort: '0x742d...0a1b', amount: 100, time: '2 hours ago', status: 'Successful' },
  { id: 2, recipientShort: '0x98dC...5C5C', amount: 50.5, time: '1 day ago', status: 'Successful' },
  { id: 3, recipientShort: '0x3f5C...f0bE', amount: 1000, time: '3 days ago', status: 'Successful' },
])

// Computed
const maxTransferable = computed(() => Math.min(walletBalance.value - networkFee.value, maxTransferPerTx.value))
const equivalentValue = computed(() => (Number.parseFloat(form.value.amount) || 0) * tokenPrice.value)
const totalAmount = computed(() => (Number.parseFloat(form.value.amount) || 0) + networkFee.value)

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

  try {
    const amountInWei = parseEther(form.value.amount)

    console.log('Sending token...')
    // Cek apakah saldo mencukupi
    if (!rawBalance.value || rawBalance.value < amountInWei) {
      toast.error('Insufficient balance')
      return null
    }

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

      // Update balance
      await refreshBalance()

      return hash
    } else {
      toast.error('Transaction failed')
      return null
    }

  } catch (error: unknown) {
    console.error('Send token error:', error)
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
const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
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
  else if (amount > maxTransferable.value) amountError.value = `Maximum transfer is ${formatNumber(maxTransferable.value)} WCH`
  else if (amount > walletBalance.value - networkFee.value) amountError.value = 'Insufficient balance'
  else amountError.value = ''
}

const setMaxAmount = () => {
  form.value.amount = Math.max(0, maxTransferable.value).toString()
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
    addressBook.value.push(newContactData)
    localStorage.setItem('addressBook', JSON.stringify(addressBook.value))
    toast.success('Contact added successfully')
    showAddContact.value = false
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

      const amount = Number.parseFloat(form.value.amount) || 0

      // Tambahkan ke riwayat transaksi
      recentTransfers.value.unshift({
        id: Date.now(),
        recipientShort: shortenAddress(form.value.recipientAddress),
        amount,
        time: 'Just now',
        status: 'Successful',
        hash
      })

      // Simpan riwayat ke localStorage
      saveToTransactionHistory({
        hash,
        from: walletAddress.value!,
        to: form.value.recipientAddress,
        amount,
        timestamp: Date.now(),
        status: 'success'
      })

      // Reset form setelah sukses
      resetForm()
    } else {
      // Jika gagal, tetap reset form
      resetForm()
    }
  } catch (error) {
    console.error('Confirm transfer error:', error)
    toast.error('Transfer confirmation failed')
  } finally {
    isLoading.value = false
  }
}

// Fungsi untuk menyimpan riwayat transaksi ke localStorage
interface TransactionHistory {
  hash: string
  from: string
  to: string
  amount: number
  timestamp: number
  status: 'pending' | 'success' | 'failed'
  memo?: string
}

const saveToTransactionHistory = (tx: TransactionHistory) => {
  try {
    const history = JSON.parse(localStorage.getItem('wancash_transactions') || '[]')
    history.unshift({
      ...tx,
      id: Date.now()
    })

    // Simpan maksimal 100 transaksi terakhir
    if (history.length > 100) {
      history.pop()
    }

    localStorage.setItem('wancash_transactions', JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save transaction history:', error)
  }
}

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

const goToPortfolio = () => router.push('/portfolio')
const goToHistory = () => router.push('/history')

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
  if (!walletAddress.value || !contractAddress.value) return

  try {
    // Di sini Anda bisa menambahkan logika untuk mengambil riwayat transaksi
    // dari blockchain menggunakan event atau API explorer
    console.log('Loading transaction history...')
  } catch (error) {
    console.error('Failed to load transaction history:', error)
  }
}

onMounted(() => {
  // Load address book dari localStorage
  const savedAddressBook = localStorage.getItem('addressBook')
  if (savedAddressBook) {
    try {
      const parsed = JSON.parse(savedAddressBook)
      if (Array.isArray(parsed) && parsed.every(item =>
        typeof item === 'object' && 'name' in item && 'address' in item
      )) {
        addressBook.value = parsed
      }
    } catch (error) {
      console.error('Error parsing address book:', error)
    }
  }

  // Load transaction history
  loadTransactionHistory()
})

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <Header @go-to-portfolio="goToPortfolio" />

      <WalletConnectionBanner v-if="!walletConnected" @connect-wallet="connectWallet" />

      <div v-if="walletConnected">
        <BalanceCard :wallet-balance="walletBalance" :token-price="tokenPrice" @refresh="() => refreshBalance()" />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <TransferForm :form="form" :minimum-transfer="minimumTransfer" :max-transferable="maxTransferable"
              :network-fee="networkFee" :estimated-time="estimatedTime" :agree-terms="agreeTerms"
              :address-error="addressError" :amount-error="amountError" :recipient-name="recipientName"
              :equivalent-value="equivalentValue" :total-amount="totalAmount" @update:form="updateForm"
              @update:agree-terms="agreeTerms = $event" @validate-address="validateAddress"
              @validate-amount="validateAmount" @set-max-amount="setMaxAmount"
              @show-address-book="showAddressBook = true" @preview-transfer="previewTransfer" @reset-form="resetForm" />
          </div>

          <div class="space-y-6">
            <TransferInfoCard :minimum-transfer="minimumTransfer" :max-transfer-per-tx="maxTransferPerTx"
              :daily-limit="dailyLimit" />
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

    <PreviewTransferDialog :open="showPreview" :form="form" :recipient-name="recipientName" :network-fee="networkFee"
      :total-amount="totalAmount" @update:open="showPreview = $event" @confirm-transfer="confirmTransfer" />

    <LoadingDialog :open="isLoading" />

    <SuccessDialog :open="showSuccess" :form="form" :recipient-name="recipientName" :transaction-hash="transactionHash"
      @update:open="showSuccess = $event" @copy-transaction-hash="copyTransactionHash" @go-to-history="goToHistory" />
  </div>
</template>
