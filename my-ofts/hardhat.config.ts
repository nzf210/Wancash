// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import '@typechain/hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig, LayerZeroHardhatUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

import './tasks/index'

/// add lib
// import '@layerzerolabs/devtools-evm-hardhat'
// import '@layerzerolabs/lz-evm-sdk-v2'

import '@layerzerolabs/verify-contract'
import '@nomicfoundation/hardhat-verify'

// Set your preferred authentication method
const MNEMONIC = process.env.MNEMONIC
const PRIVATE_KEY = process.env.PRIVATE_KEY

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const privateKeyAccounts = PRIVATE_KEY ? [PRIVATE_KEY] : undefined
const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC ? { mnemonic: MNEMONIC } : privateKeyAccounts

const MODE = process.env.MODE === 'prod'
const BSC_RPC_URL = process.env.BSC_RPC_URL || 'https://bsc-testnet.drpc.org'
const ETH_RPC_URL = process.env.ETH_RPC_URL || `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org'
const AVA_RPC_URL = process.env.AVA_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
const ARB_RPC_URL = process.env.ARB_RPC_URL || 'https://arbitrum-sepolia-rpc.publicnode.com'

const CI_BSC = process.env.CI_BSC || 97
const CI_ETH = process.env.CI_ETH || 11155111
const CI_POLYGON = process.env.CI_POLYGON || 80002
const CI_AVA = process.env.CI_AVA || 43113
const CI_ARB = process.env.CI_ARB || 421614

const ROOTSTOCK_RPC_URL = process.env.ROOTSTOCK_RPC_URL || 'https://rpc.testnet.rootstock.io'
const CI_ROOTSTOCK = process.env.CI_ROOTSTOCK || 31

// Warn if no accounts are set
if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

interface CustomLayerZeroHardhatUserConfig extends LayerZeroHardhatUserConfig {
    endpointV2: {
        avalance: string
        arbitrum: string
    }
}

interface CustomHardhatConfig extends HardhatUserConfig, CustomLayerZeroHardhatUserConfig {
    [key: string]: unknown
}

const config: CustomHardhatConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    typechain: {
        outDir: 'types',
        target: 'ethers-v5',
    },
    networks: {
        bsc: {
            url: BSC_RPC_URL,
            accounts,
            chainId: Number(CI_BSC),
            eid: MODE ? EndpointId.BSC_V2_MAINNET : EndpointId.BSC_V2_TESTNET,
        },
        // Polygon Amoy Testnet configuration
        polygon: {
            url: POLYGON_RPC_URL,
            accounts,
            chainId: Number(CI_POLYGON),
            eid: MODE ? EndpointId.POLYGON_V2_MAINNET : EndpointId.AMOY_V2_TESTNET,
        },
        ethereum: {
            url: ETH_RPC_URL,
            accounts,
            chainId: Number(CI_ETH),
            eid: MODE ? EndpointId.ETHEREUM_V2_TESTNET : EndpointId.SEPOLIA_V2_TESTNET,
        },
        arbitrum: {
            url: ARB_RPC_URL,
            accounts,
            chainId: Number(CI_ARB),
            eid: MODE ? EndpointId.ARBITRUM_V2_MAINNET : EndpointId.ARBSEP_V2_TESTNET,
        },
        avalance: {
            url: AVA_RPC_URL,
            accounts,
            chainId: Number(CI_AVA),
            eid: MODE ? EndpointId.AVALANCHE_V2_MAINNET : EndpointId.AVALANCHE_V2_TESTNET,
        },
        rootstock: {
            url: ROOTSTOCK_RPC_URL,
            accounts,
            chainId: Number(CI_ROOTSTOCK),
            eid: MODE ? EndpointId.ROOTSTOCK_V2_MAINNET : EndpointId.ROOTSTOCK_V2_TESTNET,
        },
        // Localhost configuration for testing
        hardhat: {
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY || '',
        customChains: [
            {
                network: 'bsc',
                chainId: 97, // Assuming testnet based on current context (CI_BSC default 97)
                urls: {
                    apiURL: 'https://api-testnet.bscscan.com/api',
                    browserURL: 'https://testnet.bscscan.com',
                },
            },
            {
                network: 'polygon',
                chainId: 80002,
                urls: {
                    apiURL: 'https://api-amoy.polygonscan.com/api',
                    browserURL: 'https://amoy.polygonscan.com',
                },
            },
            {
                network: 'rootstock',
                chainId: 31,
                urls: {
                    apiURL: 'https://api-testnet.rootstock.io',
                    browserURL: 'https://explorer.testnet.rootstock.io',
                },
            },
            {
                network: 'arb-sepolia',
                chainId: 421614,
                urls: {
                    apiURL: 'https://endpoints.omniatech.io/v1/arbitrum/sepolia/public',
                    browserURL: 'https://sepolia.arbiscan.io',
                },
            },
        ],
    },
    endpointV2: {
        avalance: '0x6EDCE65403992e310A62460808c4b910D972f10f',
        arbitrum: '0x6EDCE65403992e310A62460808c4b910D972f10f',
    },
    // layerZero: {
    //     endpointV2: {
    //         'fuji-ava': '0x6EDCE65403992e310A62460808c4b910D972f10f',
    //     },
    // },
    sourcify: {
        enabled: true,
    },
}

export default config
