//buyToken.vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { isHexString, } from 'ethers/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'vue-sonner'
import PancakeSwapTokenPurchase from '@/modules/buyToken/composables/usePancakeSwap'
import { useAppKitAccount, useAppKit, type UseAppKitAccountReturn } from '@reown/appkit/vue'
import type { Signer } from 'ethers';
interface TokenInfo {
  address: string
  symbol: string
  decimals: number
}

interface SimulationResult {
  tokenInfo: TokenInfo
  bnbAmount: number
  expectedTokens: string
  pricePerToken: number
  priceImpact: string
  path: string[]
}

interface TransactionResult {
  success: boolean
  transactionHash?: string
  bnbSpent?: number
  expectedTokens?: string
  minTokensOut?: string
  gasUsed?: string
  error?: string
}

// State
// const { toast } = useToast()
const connected = ref<boolean>(false)
const tokenAddress = ref<string>('')
const bnbAmount = ref<number>(0.1)
const slippage = ref<number>(1)
const loading = ref<boolean>(false)
const simulationResult = ref<SimulationResult | null>(null)
const transactionResult = ref<TransactionResult | null>(null)
// const walletAddress = ref('')
const tokenPurchase = ref<PancakeSwapTokenPurchase | null>(null)

// Providers

// Computed
const canBuy = computed(() => {
  return simulationResult.value && bnbAmount.value > 0 && tokenAddress.value
})

const accountData = useAppKitAccount() as unknown as UseAppKitAccountReturn & { signer: Signer }
const appKit = useAppKit()
// Methods
watch(
  () => accountData,
  async (newAccount) => {
    if (newAccount?.isConnected && newAccount.signer) {
      connected.value = true;
      tokenPurchase.value = new PancakeSwapTokenPurchase(newAccount.signer);
      console.log('Wallet connected:', newAccount.address);
    } else {
      connected.value = false;
      tokenPurchase.value = null;
    }
  },
  { immediate: true }
);


const simulatePurchase = async () => {
  if (!tokenAddress.value || !bnbAmount.value) return

  try {
    loading.value = true

    // Initialize tokenPurchase if not already done
    if (!tokenPurchase.value && accountData.isConnected && accountData.signer) {
      tokenPurchase.value = new PancakeSwapTokenPurchase(accountData.signer)
      await tokenPurchase.value.initialize() // Don't forget to initialize!
    }

    console.log('Simulating purchase...', tokenAddress.value, bnbAmount.value, accountData.signer)
    if (!tokenPurchase.value) {
      toast.error('Wallet not connected or token purchase not initialized')
      return
    }

    // Call getTokenPrice
    const result = await tokenPurchase.value.getTokenPrice(
      tokenAddress.value,
      bnbAmount.value.toString()
    )

    simulationResult.value = {
      tokenInfo: {
        address: tokenAddress.value,
        symbol: '', // You might want to fetch this separately
        decimals: 0, // You might want to fetch this separately
      },
      bnbAmount: parseFloat(bnbAmount.value.toString()),
      expectedTokens: result.amountOut,
      pricePerToken: result.pricePerToken,
      priceImpact: 'N/A',
      path: result.path,
    }

    toast({
      title: 'Simulasi Berhasil',
      description: `Perkiraan akan menerima ${simulationResult.value.expectedTokens} ${simulationResult.value.tokenInfo.symbol || ''}`,
    })
  } catch (error) {
    console.error('Simulation error:', error)
    toast({
      title: 'Error Simulasi',
      description: error instanceof Error ? error.message : 'Gagal melakukan simulasi',
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}

const buyToken = async () => {
  if (!canBuy.value || !tokenPurchase.value) return

  try {
    loading.value = true

    const bnbWei = BigInt(Math.floor(parseFloat(bnbAmount.value.toString()) * 1e18)).toString()
    transactionResult.value = await tokenPurchase.value.buyTokenWithBNB(
      tokenAddress.value,
      bnbWei,
      parseFloat(slippage.value.toString())
    ).then((result) => ({
      ...result,
      bnbSpent: Number(result.bnbSpent),
    }));


    if (transactionResult.value && transactionResult.value.success) {
      toast({
        title: 'Pembelian Berhasil',
        description: `Berhasil membeli token dengan TX: ${transactionResult.value.transactionHash?.slice(0, 10)}...`,
      })
    }
  } catch (error) {
    console.error('Purchase error:', error)
    transactionResult.value = {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal melakukan pembelian'
    }

    toast({
      title: 'Error Pembelian',
      description: error instanceof Error ? error.message : 'Gagal melakukan pembelian',
      variant: 'destructive',
    })
  } finally {
    loading.value = false
  }
}

const validateTokenAddress = (address: string) => {
  return isHexString(address)
}
</script>

<template>
  <Card class="max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle class="text-center">Buy Token via PancakeSwap</CardTitle>
    </CardHeader>

    <CardContent>
      <div v-if="!accountData.isConnected" class="flex flex-col items-center gap-4">
        <p class="text-sm text-muted-foreground text-center">
          Connect your wallet to start buying tokens
        </p>
        <Button @click="() => { appKit.open() }" :disabled="loading" class="w-full max-w-xs">
          <span v-if="loading" class="animate-pulse">Connecting...</span>
          <span v-else>Connect Wallet</span>
        </Button>
      </div>

      <div v-else class="space-y-6">
        <div class="space-y-2">
          <Label for="token-address">Token Address</Label>
          <Input id="token-address" v-model="tokenAddress" placeholder="0x..."
            :class="{ 'border-destructive': tokenAddress && !validateTokenAddress(tokenAddress) }" />
          <p v-if="tokenAddress && !validateTokenAddress(tokenAddress)" class="text-sm text-destructive">
            Invalid token address
          </p>
        </div>

        <div class="space-y-2">
          <Label for="bnb-amount">Number of BNB</Label>
          <Input id="bnb-amount" v-model.number="bnbAmount" type="number" step="0.01" min="0.0001" />
        </div>

        <div class="space-y-2">
          <Label for="slippage">Slippage Tolerance (%)</Label>
          <Input id="slippage" v-model.number="slippage" type="number" min="0.1" max="50" step="0.1" />
        </div>

        <div class="flex gap-4 pt-2">
          <Button @click="simulatePurchase" :disabled="loading || !tokenAddress || !validateTokenAddress(tokenAddress)"
            class="flex-1">
            <span v-if="loading">Processing...</span>
            <span v-else>Purchase Simulation</span>
          </Button>

          <Button @click="buyToken" :disabled="loading || !canBuy" class="flex-1" variant="secondary">
            Buy Tokens
          </Button>
        </div>

        <div v-if="simulationResult" class="space-y-4 p-4 border rounded-lg">
          <h3 class="font-medium">Simulation Results</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-1">
              <p class="text-muted-foreground">Token</p>
              <p>{{ simulationResult.tokenInfo.symbol }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-muted-foreground">Estimated Received</p>
              <p>{{ simulationResult.expectedTokens }} {{ simulationResult.tokenInfo.symbol }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-muted-foreground">Price per Token</p>
              <p>{{ simulationResult.pricePerToken.toFixed(8) }} BNB</p>
            </div>
            <div class="space-y-1">
              <p class="text-muted-foreground">Price Impact</p>
              <p>{{ simulationResult.priceImpact }}</p>
            </div>
          </div>
        </div>

        <div v-if="transactionResult" class="space-y-4 p-4 border rounded-lg"
          :class="{ 'border-destructive': !transactionResult.success }">
          <h3 class="font-medium">Transaction Results</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-1">
              <p class="text-muted-foreground">Status</p>
              <p :class="{ 'text-destructive': !transactionResult.success }">
                {{ transactionResult.success ? 'Berhasil' : 'Gagal' }}
              </p>
            </div>

            <template v-if="transactionResult.success">
              <div class="space-y-1">
                <p class="text-muted-foreground">BNB Spent</p>
                <p>{{ transactionResult.bnbSpent }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-muted-foreground">Amount received</p>
                <p>{{ transactionResult.expectedTokens }}</p>
              </div>
              <div class="space-y-1 col-span-2">
                <p class="text-muted-foreground">TX Hash</p>
                <a v-if="transactionResult.transactionHash"
                  :href="`https://bscscan.com/tx/${transactionResult.transactionHash}`" target="_blank"
                  class="text-primary hover:underline break-all">
                  {{ transactionResult.transactionHash }}
                </a>
              </div>
            </template>

            <div v-if="transactionResult.error" class="space-y-1 col-span-2">
              <p class="text-muted-foreground">Error</p>
              <p class="text-destructive">{{ transactionResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
