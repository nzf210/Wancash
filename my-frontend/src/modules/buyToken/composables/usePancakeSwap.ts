// Token Purchase System menggunakan PancakeSwap Router
// Pastikan sudah install: npm install ethers @pancakeswap/sdk
import { ethers, MaxUint256 } from 'ethers'
import { parseEther, formatUnits, parseUnits, formatEther, isHexString } from 'ethers/utils'
import type { JsonRpcApiProvider } from 'ethers';
// import { ChainId, Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType } from '@pancakeswap/sdk'
const { JsonRpcProvider } = ethers
/**
 * Konfigurasi Contract Addresses (BSC Mainnet)
 */

const PANCAKE_ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

// ABI untuk PancakeSwap Router
const PANCAKE_ROUTER_ABI = [
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
];

// ABI untuk ERC20 Token
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)'
];

class PancakeSwapTokenPurchase {
    provider: JsonRpcApiProvider
    wallet: ethers.Wallet
    router: ethers.Contract
    constructor(providerUrl: string, privateKey: string) {
        this.provider = new JsonRpcProvider(providerUrl)
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, PANCAKE_ROUTER_ABI, this.wallet)
    }

    // Mendapatkan harga token dari PancakeSwap
    async getTokenPrice(tokenAddress : string, amountIn = '1') {
        try {
            const path = [WBNB_ADDRESS, tokenAddress]
            const amountInWei = parseEther(amountIn)

            const amounts = await this.router.getAmountsOut(amountInWei, path);
            const amountOut = amounts[amounts.length - 1]

            // Mendapatkan decimals token untuk konversi yang tepat
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
            const decimals = await tokenContract.decimals()

            const price = formatUnits(amountOut, decimals)

            return {
                amountIn: amountIn,
                amountOut: price,
                pricePerToken: parseFloat(amountIn) / parseFloat(price),
                path: path
            };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error getting token price: ${error.message}`)
          } else {
            throw new Error(`Unknown error: ${error}`)
          }
        }
    }

    // Membeli token dengan BNB
    async buyTokenWithBNB(tokenAddress : string, bnbAmount : bigint, slippageTolerance = 3) {
        try {
            const path = [WBNB_ADDRESS, tokenAddress];
            const amountIn = parseEther(bnbAmount.toString());

            // Mendapatkan expected output
            const amounts = await this.router.getAmountsOut(amountIn, path);
            const amountOutMin = amounts[amounts.length - 1];

            // Menerapkan slippage tolerance
            const slippageAmount = amountOutMin.mul(slippageTolerance).div(100);
            const minAmountOut = amountOutMin.sub(slippageAmount);

            // Deadline (20 menit dari sekarang)
            const deadline = Math.floor(Date.now() / 1000) + (20 * 60);

            // Estimasi gas
            const gasLimit = await this.router.estimateGas(
              'swapExactETHForTokens',
              minAmountOut,
              path,
              this.wallet.address,
              deadline,
              { value: amountIn }
            );
            // Melakukan swap
            const transaction = await this.router.swapExactETHForTokens(
                minAmountOut,
                path,
                this.wallet.address,
                deadline,
                {
                    value: amountIn,
                    gasLimit: gasLimit.mul(110).div(100) // Tambah 10% gas buffer
                }
            );

            const receipt = await transaction.wait()

            return {
                success: true,
                transactionHash: receipt.transactionHash,
                bnbSpent: bnbAmount,
                expectedTokens: formatUnits(amountOutMin, 18),
                minTokensOut: formatUnits(minAmountOut, 18),
                gasUsed: receipt.gasUsed.toString()
            };

        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error Buy token: ${error.message}`)
          } else {
            throw new Error(`Unknown error: ${error}`)
          }
        }
    }

    // Membeli token dengan token lain
    async buyTokenWithToken(fromTokenAddress: string, toTokenAddress : string, amount: bigint, slippageTolerance = 3) {
        try {
            const fromTokenContract = new ethers.Contract(fromTokenAddress, ERC20_ABI, this.wallet)
            const fromDecimals = await fromTokenContract.decimals()
            const amountIn = parseUnits(amount.toString(), fromDecimals)

            // Cek allowance
            const allowance = await fromTokenContract.allowance(this.wallet.address, PANCAKE_ROUTER_ADDRESS);

            if (allowance.lt(amountIn)) {
                console.log('Approving token...')
                const approveTx = await fromTokenContract.approve(PANCAKE_ROUTER_ADDRESS, MaxUint256)
                await approveTx.wait();
                console.log('Token approved')
            }

            // Setup path
            let path: string[];
            if (fromTokenAddress === WBNB_ADDRESS) {
                path = [fromTokenAddress, toTokenAddress];
            } else if (toTokenAddress === WBNB_ADDRESS) {
                path = [fromTokenAddress, toTokenAddress];
            } else {
                path = [fromTokenAddress, WBNB_ADDRESS, toTokenAddress];
            }

            // Mendapatkan expected output
            const amounts = await this.router.getAmountsOut(amountIn, path)
            const amountOutMin = amounts[amounts.length - 1]

            // Menerapkan slippage tolerance
            const slippageAmount = amountOutMin.mul(slippageTolerance).div(100)
            const minAmountOut = amountOutMin.sub(slippageAmount)

            // Deadline
            const deadline = Math.floor(Date.now() / 1000) + (20 * 60)

            // Melakukan swap
            const transaction = await this.router.swapExactTokensForTokens(
                amountIn,
                minAmountOut,
                path,
                this.wallet.address,
                deadline
            );

            const receipt = await transaction.wait()

            return {
                success: true,
                transactionHash: receipt.transactionHash,
                amountIn: amount,
                path: path,
                gasUsed: receipt.gasUsed.toString()
            };

        } catch (error: unknown) {
          if (error instanceof Error) {
            return {
              success: false,
              error: error.message
            };
          } else {
            return {
              success: false,
              error: 'An unknown error occurred'
            };
          }
        }
    }

    // Mendapatkan balance token
    async getTokenBalance(tokenAddress: string, walletAddress = null) {
        try {
            const address = walletAddress ?? this.wallet.address

            if (tokenAddress.toLowerCase() === WBNB_ADDRESS.toLowerCase() || tokenAddress === 'BNB') {
                const balance = await this.provider.getBalance(address)
                return formatEther(balance)
            }

            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)
            const balance = await tokenContract.balanceOf(address)
            const decimals = await tokenContract.decimals()

            return formatUnits(balance, decimals)
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error Get token Balance: ${error.message}`)
          } else {
            throw new Error(`Unknown error: ${error}`)
          }
        }
    }

    // Mendapatkan info token
    async getTokenInfo(tokenAddress: string) {
        try {
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)

            const [symbol, decimals] = await Promise.all([
                tokenContract.symbol(),
                tokenContract.decimals()
            ]);

            return {
                address: tokenAddress,
                symbol: symbol,
                decimals: decimals
            };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error Get token info: ${error.message}`)
          } else {
            throw new Error(`Unknown error: ${error}`)
          }
        }
    }

    // Simulasi pembelian (tanpa eksekusi)
    async simulatePurchase(tokenAddress: string, bnbAmount: number) {
        try {
            const path = [WBNB_ADDRESS, tokenAddress]
            const amountIn = parseEther(bnbAmount.toString())

            const amounts = await this.router.getAmountsOut(amountIn, path)
            const amountOut = amounts[amounts.length - 1]

            const tokenInfo = await this.getTokenInfo(tokenAddress)
            const expectedTokens = formatUnits(amountOut, tokenInfo.decimals)

            // Hitung price impact
            const smallAmount = parseEther('0.1')
            const smallAmounts = await this.router.getAmountsOut(smallAmount, path)
            const basePrice = smallAmounts[1];
            const currentPrice = amountOut.mul(parseEther('0.1')).div(amountIn)

            const priceImpact = basePrice.sub(currentPrice).mul(100).div(basePrice)

            return {
                tokenInfo: tokenInfo,
                bnbAmount: bnbAmount,
                expectedTokens: expectedTokens,
                pricePerToken: parseFloat(bnbAmount.toString()) / parseFloat(expectedTokens),
                priceImpact: formatEther(priceImpact.abs()) + '%',
                path: path
            };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error Simulate Purchase info: ${error.message}`)
          } else {
            throw new Error(`Unknown error: ${error}`)
          }
        }
    }
}

// Contoh penggunaan
// async function example() {
//     // Inisialisasi (ganti dengan RPC URL dan private key Anda)
//     const BSC_RPC_URL = 'https://bsc-dataseed1.binance.org/';
//     const PRIVATE_KEY = 'your-private-key-here';

//     const tokenBuyer = new PancakeSwapTokenPurchase(BSC_RPC_URL, PRIVATE_KEY);

//     // Contoh address token (CAKE token)
//     const CAKE_TOKEN = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82';

//     try {
//         // 1. Simulasi pembelian
//         console.log('Simulating purchase...');
//         const simulation = await tokenBuyer.simulatePurchase(CAKE_TOKEN, 0.1);
//         console.log('Simulation:', simulation);

//         // 2. Cek harga token
//         console.log('Getting token price...');
//         const price = await tokenBuyer.getTokenPrice(CAKE_TOKEN, '1');
//         console.log('Price:', price);

//         // 3. Cek balance
//         console.log('Getting BNB balance...');
//         const bnbBalance = await tokenBuyer.getTokenBalance('BNB');
//         console.log('BNB Balance:', bnbBalance);

//         // 4. Beli token (uncomment untuk eksekusi real)
//         /*
//         console.log('Buying tokens...');
//         const purchase = await tokenBuyer.buyTokenWithBNB(CAKE_TOKEN, 0.01, 5);
//         console.log('Purchase result:', purchase);
//         */

//     } catch (error: unknown) {
//           if (error instanceof Error) {
//             throw new Error(`Error Simulate Purchase info: ${error.message}`);
//           } else {
//             throw new Error(`Unknown error: ${error}`);
//           }
//         }
// }

// Export class untuk digunakan
export default PancakeSwapTokenPurchase;

// Fungsi helper untuk frontend integration
export const createTokenPurchaseInstance = (rpcUrl: string, privateKey: string) => {
    return new PancakeSwapTokenPurchase(rpcUrl, privateKey)
};

// Fungsi untuk mendapatkan harga real-time
export const getTokenPrice = async (tokenAddress: string, rpcUrl: string) => {
    const provider = new JsonRpcProvider(rpcUrl);
    const router = new ethers.Contract(PANCAKE_ROUTER_ADDRESS, PANCAKE_ROUTER_ABI, provider);

    const path = [WBNB_ADDRESS, tokenAddress]
    const amountIn = parseEther('1')

    try {
        const amounts = await router.getAmountsOut(amountIn, path)
        return formatEther(amounts[amounts.length - 1])
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
    return isHexString(address)
}
