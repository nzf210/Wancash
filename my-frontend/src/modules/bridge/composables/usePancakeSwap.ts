// usePancakeSwap.ts
import { BrowserProvider, ethers } from 'ethers'
import type { AppKit } from '@reown/appkit';
import { getProvider , getAccounts } from '@/app/components/config/appkit'

const PANCAKE_ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
] as const

const PANCAKE_ROUTER_ABI = [
  'function getAmountsOut(uint256 amountIn, address[] memory path) view returns (uint256[] memory amounts)',
  'function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) payable returns (uint256[] memory amounts)',
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) returns (uint256[] memory amounts)',
] as const;

type PancakeRouter = {
  getAmountsOut(amountIn: bigint, path: string[]): Promise<bigint[]>;
  swapExactETHForTokens(
    amountOutMin: bigint,
    path: string[],
    to: string,
    deadline: number,
    overrides?: { value?: bigint }
  ): Promise<ethers.TransactionResponse>;
  swapExactTokensForTokens(
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    to: string,
    deadline: number,
    overrides?: unknown
  ): Promise<ethers.TransactionResponse>;
  connect(signer: ethers.Signer): PancakeRouter;
};

class PancakeSwapTokenPurchase {
  private provider!: ethers.BrowserProvider;
  private router!: PancakeRouter;
  private readonly appKit?: AppKit | string;

constructor(signerOrAppKit?: ethers.Signer | AppKit | string) {
  if (typeof signerOrAppKit !== 'string') {
    this.router = new ethers.Contract(
      PANCAKE_ROUTER_ADDRESS,
      PANCAKE_ROUTER_ABI,
      signerOrAppKit as ethers.Signer
    ) as unknown as PancakeRouter;
} else if (typeof signerOrAppKit === 'string') {
    // Handle case for RPC URL
    this.appKit = signerOrAppKit;
  }
}

async initialize(): Promise<void> {
  const provider = await getProvider() as ethers.Eip1193Provider;
  this.provider = new BrowserProvider(provider);
  this.router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, PANCAKE_ROUTER_ABI, this.provider) as unknown as PancakeRouter;
}

  async getWalletAddress(): Promise<string> {
    const accounts = await getAccounts();
    if (!accounts?.length) throw new Error('No wallet connected');
    return accounts[0];
  }

  private async getSigner(): Promise<ethers.Signer> {
    return await this.provider.getSigner();
  }

  async getTokenPrice(tokenAddress: string, amountIn: string = '1') {
    try {
      const path = [WBNB_ADDRESS, tokenAddress];
      const amountInWei = ethers.parseEther(amountIn);

      const amounts = await this.router.getAmountsOut(amountInWei, path);
      const amountOut = amounts[amounts.length - 1];

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const decimals = await tokenContract.decimals();

      const price = ethers.formatUnits(amountOut, decimals);

      return {
        amountIn,
        amountOut: price,
        pricePerToken: parseFloat(amountIn) / parseFloat(price),
        path,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to get price: ${error.message}`);
      } else {
        throw new Error(`Unknown error: ${error}`);
      }
    }
  }

  async buyTokenWithBNB(tokenAddress: string, bnbAmount: string, slippageTolerance: number = 0.5) {
    try {
      const signer = await this.getSigner();
      const routerWithSigner = this.router.connect(signer);
      const walletAddress = await this.getWalletAddress();

      const path = [WBNB_ADDRESS, tokenAddress];
      const amountIn = ethers.parseEther(bnbAmount);

      const amounts = await routerWithSigner.getAmountsOut(amountIn, path);
      const amountOutMin = amounts[amounts.length - 1];

      const minAmountOut = amountOutMin * (10000n - BigInt(slippageTolerance * 100)) / 10000n;

      const deadline = Math.floor(Date.now() / 1000) + 1200;

      const tx = await routerWithSigner.swapExactETHForTokens(
        minAmountOut,
        path,
        walletAddress,
        deadline,
        { value: amountIn },
      );

      const receipt = await tx.wait();

      if (!receipt) {
        return { success: false, error: 'Transaction receipt is null or transaction not mined' };
      }

      return {
        success: true,
        txHash: receipt.hash,
        bnbSpent: bnbAmount,
        minTokensOut: ethers.formatUnits(minAmountOut, await this.getTokenDecimals(tokenAddress)),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Purchase failed:', error);
        return { success: false, error: error.message };
      } else {
        return { success: false, error: 'Unknown error' };
      }
    }
  }

    // Helper untuk mendapatkan decimals token
    private async getTokenDecimals(tokenAddress: string): Promise<number> {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
        return Number(await tokenContract.decimals());
    }
}

export default PancakeSwapTokenPurchase;

// Fungsi helper untuk frontend integration
export const createTokenPurchaseInstance = (rpcUrl: string) => {
    return new PancakeSwapTokenPurchase(rpcUrl)
};

// Fungsi untuk mendapatkan harga real-time
export const getTokenPrice = async (tokenAddress: string, rpcUrl: string) => {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, PANCAKE_ROUTER_ABI, provider);

    const path = [WBNB_ADDRESS, tokenAddress]
    const amountIn = ethers.parseEther('1')

    try {
        const amounts = await router.getAmountsOut(amountIn, path)
        return ethers.formatEther(amounts[amounts.length - 1])
    } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error getTokenPrice: ${error.message}`)
          } else {
            throw new Error(`Unknown error: ${error}`)
          }
        }
};

// Fungsi untuk memvalidasi address
export const isValidAddress = (address: string) => {
    return ethers.isHexString(address)
}
