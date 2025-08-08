import * as dotenv from 'dotenv'
// import * as Ethers from 'ethers'
import { BigNumber, Contract } from 'ethers'
import { task } from 'hardhat/config'
dotenv.config()

// Network configuration mapping
const NETWORK_CONFIG = {
    'bsc-testnet': {
        eid: 40102,
        contractEnvKey: 'BSC_CONTRACT',
        name: 'BSC Testnet',
    },
    sepolia: {
        eid: 40161,
        contractEnvKey: 'ETH_CONTRACT',
        name: 'Ethereum Sepolia',
    },
    'sepolia-arb': {
        eid: 40231,
        contractEnvKey: 'ARB_CONTRACT',
        name: 'Arbitrum Sepolia',
    },
    amoy: {
        eid: 40267,
        contractEnvKey: 'POLY_CONTRACT',
        name: 'Polygon Amoy',
    },
    fuji: {
        eid: 40106,
        contractEnvKey: 'FUJI_CONTRACT',
        name: 'Avalanche Fuji',
    },
    rootstock: {
        eid: 40350, // Rootstock testnet EID
        contractEnvKey: 'ROOT_CONTRACT',
        name: 'Rootstock Testnet',
    },
    lz: {
        eid: 0, // LayerZero EID
        contractEnvKey: 'LZ_CONTRACT',
        name: 'LayerZero',
    },
} as const

type NetworkName = keyof typeof NETWORK_CONFIG

function getNetworkConfig(networkName: string) {
    const config = NETWORK_CONFIG[networkName as NetworkName]
    if (!config) {
        throw new Error(`Unsupported network: ${networkName}. Supported: ${Object.keys(NETWORK_CONFIG).join(', ')}`)
    }
    return config
}

function getContractAddress(networkName: string): string {
    const config = getNetworkConfig(networkName)
    const address = process.env[config.contractEnvKey]
    if (!address) {
        throw new Error(
            `Contract address not found for ${networkName}. Please set ${config.contractEnvKey} in .env file`
        )
    }
    return address
}

function getAllNetworkInfo() {
    return Object.entries(NETWORK_CONFIG).map(([network, config]) => ({
        network,
        ...config,
        contractAddress: process.env[config.contractEnvKey] || 'NOT_SET',
    }))
}

const EXPLORER_URLS: Record<NetworkName, string> = {
    'bsc-testnet': 'https://testnet.bscscan.com/tx/',
    sepolia: 'https://sepolia.etherscan.io/tx/',
    amoy: 'https://www.oklink.com/amoy/tx/',
    fuji: 'https://testnet.snowtrace.io/tx/',
    rootstock: 'https://explorer.testnet.rsk.co/tx/',
    'sepolia-arb': 'https://sepolia.arbiscan.io/tx/',
    lz: 'https://explorer.layerzero.io/tx/',
}

const EXTRA_OPTIONS_TO_TRY = [
    // Very Low Gas (Not recommended, for edge testing only)
    '0x000301001101000000000000000000000000000061a8', // 25,000
    '0x0003010011010000000000000000000000000000c350', // 50,000
    '0x000301001101000000000000000000000000000186a0', // 100,000

    // Low Range
    '0x000301001101000000000000000000000000000249f0', // 150,000
    '0x00030100110100000000000000000000000000030d40', // 200,000 (standard)
    '0x0003010011010000000000000000000000000003d090', // 250,000
    '0x000301001101000000000000000000000000000493e0', // 300,000
    '0x00030100110100000000000000000000000000061a80', // 400,000

    // Mid Range
    '0x0003010011010000000000000000000000000007a120', // 500,000
    '0x00030100110100000000000000000000000000098968', // 625,000
    '0x000301001101000000000000000000000000000bebc', // 750,000
    '0x000301001101000000000000000000000000000f4240', // 1,000,000
    '0x0003010011010000000000000000000000000013d620', // 1,300,000
    '0x00030100110100000000000000000000000000186a00', // 1,600,000

    // High Range
    '0x000301001101000000000000000000000000001e8480', // 2,000,000
    '0x000301001101000000000000000000000000002625a0', // 2,500,000
    '0x000301001101000000000000000000000000002dc6c0', // 3,000,000
    '0x000301001101000000000000000000000000003d0900', // 4,000,000
    '0x000301001101000000000000000000000000004c4b40', // 5,000,000

    // Ultra High (for very complex txs or special networks)
    '0x0003010011010000000000000000000000000062a160', // 6,400,000
    '0x000301001101000000000000000000000000007a1200', // 8,000,000
    '0x00030100110100000000000000000000000000989680', // 10,000,000
    '0x00030100110100000000000000000000000000bebc20', // 12,500,000
    '0x00030100110100000000000000000000000000e4e1c0', // 15,000,000
] as const

type ResultLogEntry = {
    gasAmount: number
    extraOptions: string
    success: boolean
    nativeFee?: string
    error?: string
}

type FindResult = {
    workingExtraOptions: string
    quote?: { nativeFee: BigNumber; lzTokenFee: BigNumber }
    resultLog: ResultLogEntry[]
}

/**
 * Mencari extraOptions yang berhasil memproduksi quote.
 * Mengembalikan workingExtraOptions, quote (jika ada), dan resultLog (untuk table summary).
 * Semua logging asli dipertahankan di sini (agar perilaku identik).
 */
export async function findWorkingExtraOptions(
    contract: Contract,
    dstEid: number,
    to: string,
    amount: string,
    minAmount: string,
    ethers: {
        utils: {
            formatEther: (arg0: string) => string
            hexZeroPad: (arg0: string, arg1: number) => string
            parseEther: (arg0: string) => BigNumber
        }
    },
    extraOptionsList: readonly string[] = EXTRA_OPTIONS_TO_TRY
): Promise<FindResult> {
    const resultLog: ResultLogEntry[] = []

    console.log('\n🧪 Testing extraOptions configurations...')
    for (const extraOptions of extraOptionsList) {
        const gasAmount = parseInt(extraOptions.slice(-8), 16)
        console.log(`   Testing with ${gasAmount.toLocaleString()} gas...`)

        try {
            const q = await contract.quoteSend(
                {
                    dstEid,
                    to: ethers.utils.hexZeroPad(to, 32),
                    amountLD: ethers.utils.parseEther(amount),
                    minAmountLD: ethers.utils.parseEther(minAmount),
                    extraOptions: extraOptions,
                    composeMsg: '0x',
                    oftCmd: '0x',
                },
                false
            )

            if (q) {
                const nativeFeeStr = ethers.utils.formatEther(q.nativeFee.toString())
                console.log(`✅ Success! Native fee: ${nativeFeeStr} ETH`)

                // catat sukses dan keluarkan hasil
                resultLog.push({
                    gasAmount,
                    extraOptions,
                    success: true,
                    nativeFee: nativeFeeStr,
                })

                return {
                    workingExtraOptions: extraOptions,
                    quote: q,
                    resultLog,
                }
            } else {
                // gagal namun tanpa exception
                resultLog.push({
                    gasAmount,
                    extraOptions,
                    success: false,
                    error: 'Failed to get quote',
                })
                console.error('Failed to get quote')
            }
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Unknown error'
            resultLog.push({
                gasAmount,
                extraOptions,
                success: false,
                error: msg,
            })
            if (error instanceof Error) {
                console.error(`❌ Error occurred while testing extraOptions: ${error.message}`)
                console.error(error.stack)
            } else {
                console.error('An unknown error occurred')
            }
        }
    }

    // tidak ada yang berhasil
    return {
        workingExtraOptions: '',
        quote: undefined,
        resultLog,
    }
}

export function computePaddedNativeFee(quote?: { nativeFee: BigNumber } | undefined) {
    return quote?.nativeFee ? quote.nativeFee.mul(110).div(100) : undefined
}

export function fmtBN(bn: BigNumber | undefined, ethers: { utils: { formatEther: (arg0: string) => string } }) {
    return bn ? ethers.utils.formatEther(bn.toString()) : '-'
}

// ---------- task (tetap mempertahankan alur & logging, tapi ringkas) ----------

task('lz:oft:send', 'Send OFT tokens between any supported networks')
    .addParam('amount', 'Amount to send (in tokens)')
    .addParam('to', 'Recipient address')
    .addParam('dst', 'Destination network name (bsc-testnet, sepolia, amoy, fuji, rootstock)')
    .addOptionalParam('minamount', 'Minimum amount to receive')
    .setAction(async (taskArgs, hre) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()

        const srcNetwork = hre.network.name
        const dstNetwork = taskArgs.dst

        console.log(`🚀 Universal OFT Transfer`)
        console.log(`   From: ${getNetworkConfig(srcNetwork).name} (${srcNetwork})`)
        console.log(`   To: ${getNetworkConfig(dstNetwork).name} (${dstNetwork})`)
        console.log(`   Amount: ${taskArgs.amount} tokens`)
        console.log(`   Recipient: ${taskArgs.to}`)

        // Validate networks
        if (srcNetwork === dstNetwork) {
            throw new Error('Source and destination networks cannot be the same')
        }

        // Get contract addresses and EIDs
        const srcContract = getContractAddress(srcNetwork)
        const dstContract = getContractAddress(dstNetwork)
        const srcEid = getNetworkConfig(srcNetwork).eid
        const dstEid = getNetworkConfig(dstNetwork).eid

        console.log(`Source contract: ${srcContract}`)
        console.log(`Destination contract: ${dstContract}`)
        console.log(`Source EID: ${srcEid} -> Destination EID: ${dstEid}`)

        // Set default minimum amount if not provided
        const minAmount = taskArgs.minamount || (parseFloat(taskArgs.amount) * 0.98).toString()

        const contract = await ethers.getContractAt('MyOFTMock', srcContract, signer)

        // PANGGIL helper luar — loop & try/catch ada di sana
        const { workingExtraOptions, quote, resultLog } = await findWorkingExtraOptions(
            contract,
            dstEid,
            taskArgs.to,
            taskArgs.amount,
            minAmount,
            ethers
        )

        // Summary log (preserved)
        if (resultLog.length > 0) {
            console.log('\n📊 Summary Result:')
            console.table(
                resultLog.map((r) => ({
                    Gas: r.gasAmount.toLocaleString(),
                    Success: r.success,
                    'Native Fee (ETH)': r.nativeFee ?? '-',
                    Error: r.error ?? '-',
                }))
            )
        }

        if (!workingExtraOptions) {
            throw new Error('No working extraOptions found! Check peer configuration between networks.')
        }

        // Hitung padded fee dengan +10% (preserved)
        const paddedNativeFee = computePaddedNativeFee(quote)

        // Send the actual transaction (preserved)
        console.log(`\n📤 Sending transaction...`)
        console.log(`   Gas configuration: ${workingExtraOptions}`)
        quote && console.log(`Estimated fee: ${fmtBN(paddedNativeFee, ethers)} ETH`)

        const sendParams = {
            dstEid: dstEid,
            to: ethers.utils.hexZeroPad(taskArgs.to, 32),
            amountLD: ethers.utils.parseEther(taskArgs.amount),
            minAmountLD: ethers.utils.parseEther(minAmount),
            extraOptions: workingExtraOptions,
            composeMsg: '0x',
            oftCmd: '0x',
        }

        const tx = await contract.send(
            sendParams,
            { nativeFee: paddedNativeFee, lzTokenFee: quote?.lzTokenFee },
            signer.address,
            { value: paddedNativeFee }
        )

        console.log(`\n✅ Transaction sent!`)
        console.log(`   Hash: ${tx.hash}`)
        console.log(`   LzTrx: https://testnet.layerzeroscan.com/tx/${tx.hash}`)
        console.log(`   Waiting for confirmation...`)

        const explorerBase = EXPLORER_URLS[srcNetwork as NetworkName]
        getNetworkInfo(explorerBase, srcNetwork, tx)
        const receipt = await tx.wait()
        console.log(`\n🎉 Transaction confirmed!`)
        console.log(`   Block: ${receipt.blockNumber}`)
        console.log(`   Gas used: ${receipt.gasUsed?.toString()}`)
        console.log(`   Successfully sent ${taskArgs.amount} tokens from ${srcNetwork} to ${dstNetwork}`)
    })

// Network info task
task('lz:networks:list', 'List all configured networks and their details').setAction(async (taskArgs, hre) => {
    console.log('🌐 Configured Networks:')
    console.log('='.repeat(80))

    const networks = getAllNetworkInfo()

    networks.forEach((network) => {
        const status = network.contractAddress !== 'NOT_SET' ? '✅ Ready' : '❌ Missing contract'
        console.log(`${network.name}`)
        console.log(`   Network: ${network.network}`)
        console.log(`   EID: ${network.eid}`)
        console.log(`   Contract: ${network.contractAddress}`)
        console.log(`   Status: ${status}`)
        console.log()
    })

    console.log('💡 To set missing contracts, add to .env file:')
    networks
        .filter((n) => n.contractAddress === 'NOT_SET')
        .forEach((n) => {
            console.log(`   ${n.contractEnvKey}=YOUR_CONTRACT_ADDRESS`)
        })
})

function getNetworkInfo(explorerBase: string, srcNetwork: string, tx: { hash: string }): void {
    if (explorerBase) {
        console.log(`   🔍 View on Explorer: ${explorerBase}${tx.hash}`)
    } else {
        console.log(`   ⚠️ No explorer URL configured for ${srcNetwork}`)
    }
}

// Peer management task
task('lz:peer:set:auto', 'Set peer between two networks automatically')
    .addParam('src', 'Source network')
    .addParam('dst', 'Destination network')
    .setAction(async (taskArgs, hre) => {
        const { src, dst } = taskArgs
        // 1️⃣ Setup src ➡️ dst
        {
            const srcContract = getContractAddress(src)
            const dstContract = getContractAddress(dst)
            const dstEid = getNetworkConfig(dst).eid

            console.log(`🔗 Setting peer from ${src} ➡️ ${dst}`)
            await hre.run('lz:oapp:peer:set', {
                eid: dstEid.toString(),
                contract: srcContract,
                peer: dstContract,
            })
            console.log(`✅ Peer setup complete between: ${src} ➡️ :${dst}`)
        }
    })

// Environment setup helper
task('lz:setup:env', 'Generate .env template for all networks').setAction(async (taskArgs, hre) => {
    console.log('📝 .env Template for Cross-Chain Setup:')
    console.log('='.repeat(50))
    console.log('# Private key for all networks')
    console.log('PRIVATE_KEY=your_private_key_here')
    console.log()
    console.log('# Contract addresses for each network')
    Object.entries(NETWORK_CONFIG).forEach(([network, config]) => {
        console.log(`${config.contractEnvKey}=  # ${config.name} contract address`)
    })
    console.log()
    console.log('# API Keys (if needed)')
    console.log('ALCHEMY_API_KEY=your_alchemy_key')
    console.log('GETBLOCK_API_KEY=your_getblock_key')
    console.log('ANKR_API_KEY=your_ankr_key')
})
