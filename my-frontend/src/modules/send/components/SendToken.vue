<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <Header @go-to-portfolio="goToPortfolio" />

      <WalletConnectionBanner v-if="!walletConnected" @connect-wallet="connectWallet" />

      <div v-if="walletConnected">
        <BalanceCard :wallet-balance="walletBalance" :token-price="tokenPrice" />

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

// Interfaces (kept for type safety)
interface Contact { name: string; address: string }
interface Transfer { id: number; recipientShort: string; amount: number; time: string; status: string }
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
const walletBalance = ref<number>(1500.75)
const tokenPrice = ref<number>(5000)
const recipientName = ref<string>('')
const minimumTransfer = ref<number>(1)
const maxTransferPerTx = ref<number>(10000)
const dailyLimit = ref<number>(50000)
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

// Methods
const updateForm = (updatedForm: FormData) => { form.value = { ...form.value, ...updatedForm } }
const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
// const formatCurrency = (num: number) => new Intl.NumberFormat('id-ID').format(Math.round(num))
const shortenAddress = (address: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
// const shortenTransactionHash = (hash: string) => hash ? `${hash.slice(0, 8)}...${hash.slice(-6)}` : ''

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
  if (amount < minimumTransfer.value) amountError.value = `Minimum transfer is ${minimumTransfer.value} GLD`
  else if (amount > maxTransferable.value) amountError.value = `Maximum transfer is ${formatNumber(maxTransferable.value)} GLD`
  else if (amount > walletBalance.value - networkFee.value) amountError.value = 'Insufficient balance'
  else amountError.value = ''
}

const setMaxAmount = () => { form.value.amount = maxTransferable.value.toString(); validateAmount() }

const selectContact = (contact: Contact) => {
  form.value.recipientAddress = contact.address
  recipientName.value = contact.name
  showAddressBook.value = false
  validateAddress()
}

const saveContact = (newContactData: Contact) => {
  if (newContactData.name.trim() && newContactData.address.trim()) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(newContactData.address.trim())) { toast.error('Invalid wallet address format'); return }
    addressBook.value.push(newContactData)
    localStorage.setItem('addressBook', JSON.stringify(addressBook.value))
    toast.success('Contact added successfully')
    showAddContact.value = false
  }
}

const previewTransfer = () => { if (isFormValid.value) showPreview.value = true }

const confirmTransfer = async () => {
  showPreview.value = false
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    showSuccess.value = true
    const hexChars = '0123456789abcdef'
    transactionHash.value = '0x' + Array.from({ length: 64 }, () => hexChars[Math.floor(Math.random() * 16)]).join('')
    const amount = Number.parseFloat(form.value.amount) || 0
    walletBalance.value -= (amount + networkFee.value)
    recentTransfers.value.unshift({
      id: Date.now(),
      recipientShort: shortenAddress(form.value.recipientAddress),
      amount,
      time: 'Just now',
      status: 'Successful'
    })
    toast.success('Transfer successful!', { description: `${formatNumber(amount)} GLD successfully sent`, duration: 5000 })
  }, 2000)
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
  const hexChars = '0123456789abcdef'
  const mockAddress = '0x' + Array.from({ length: 40 }, () => hexChars[Math.floor(Math.random() * 16)]).join('')
  try {
    await navigator.clipboard.writeText(mockAddress)
    toast.success('Address successfully copied to clipboard')
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error('Failed to copy address')
    }
    toast.error('Failed to copy address')
  }
}
const copyTransactionHash = async () => {
  try {
    await navigator.clipboard.writeText(transactionHash.value)
    toast.success('Transaction hash successfully copied')
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error('Failed to copy transaction hash')
    }
    toast.error('Failed to copy transaction hash')
  }
}
const goToPortfolio = () => router.push('/portfolio')
const goToHistory = () => router.push('/history')

const isFormValid = computed(() => {
  const amount = Number.parseFloat(form.value.amount)
  return form.value.recipientAddress.trim() !== '' &&
    amount >= minimumTransfer.value &&
    amount <= maxTransferable.value &&
    !addressError.value &&
    !amountError.value &&
    agreeTerms.value
})

onMounted(() => {
  const savedAddressBook = localStorage.getItem('addressBook')
  if (savedAddressBook) {
    try {
      const parsed = JSON.parse(savedAddressBook)
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && 'name' in item && 'address' in item)) {
        addressBook.value = parsed
      }
    } catch (error) {
      console.error('Error parsing address book:', error)
    }
  }
})
</script>
