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
import { HardhatUserConfig, HttpNetworkAccountsUserConfig, LayerZeroHardhatUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

import './tasks/index'

/// add lib
// import '@layerzerolabs/devtools-evm-hardhat'
// import '@layerzerolabs/lz-evm-sdk-v2'
// import '@nomicfoundation/hardhat-ethers'
import '@layerzerolabs/verify-contract'
import '@nomicfoundation/hardhat-verify'

// Set your preferred authentication method
//
const BSC_TESTNET_RPC_URL = process.env.BSC_TESTNET_RPC_URL || ''
const BSC_TESTNET_PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL || ''
const POLYGON_AMOY_PRIVATE_KEY = process.env.PRIVATE_KEY || ''
// const SEPOLIA_RPC_URL = process.env.SEPOLIA_TESTNET_RPC_URL || ''
// const SEPOLIA_PRIVATE_KEY = process.env.PRIVATE_KEY || ''
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC
const PRIVATE_KEY = process.env.PRIVATE_KEY
// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const privateKeyAccounts = PRIVATE_KEY ? [PRIVATE_KEY] : undefined

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC ? { mnemonic: MNEMONIC } : privateKeyAccounts

// Warn if no accounts are set
if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

interface CustomLayerZeroHardhatUserConfig extends LayerZeroHardhatUserConfig {
    endpointV2: {
        fuji: string
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
    networks: {
        // BSC Testnet configuration
        'bsc-testnet': {
            url: BSC_TESTNET_RPC_URL,
            accounts: [BSC_TESTNET_PRIVATE_KEY],
            chainId: 97,
            eid: EndpointId.BSC_V2_TESTNET,
        },
        // Polygon Amoy Testnet configuration
        amoy: {
            url: POLYGON_AMOY_RPC_URL,
            accounts: [POLYGON_AMOY_PRIVATE_KEY],
            chainId: 80002,
            eid: EndpointId.AMOY_V2_TESTNET,
        },
        // Polygon Amoy Testnet configuration
        sepolia: {
            eid: EndpointId.SEPOLIA_V2_TESTNET,
            url: process.env.RPC_URL_SEPOLIA || 'https://ethereum-sepolia-rpc.publicnode.com',
            accounts,
        },
        fuji: {
            eid: EndpointId.AVALANCHE_V2_TESTNET,
            url: 'https://api.avax-test.network/ext/bc/C/rpc',
            accounts,
        },
        rootstock: {
            eid: EndpointId.ROOTSTOCK_V2_TESTNET,
            url: process.env.RPC_URL_ROOTSTOCK_TESTNET || 'https://rpc.testnet.rootstock.io',
            accounts,
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
        // apiKey: {
        //     // Add your API keys here if you want to verify contracts
        //     sepolia: process.env.ETHERSCAN_API_KEY || '',
        //     'bsc-testnet': process.env.BSCSCAN_API_KEY || '',
        //     amoy: process.env.POLYGONSCAN_API_KEY || '',
        // },
        apiKey: process.env.ETHERSCAN_API_KEY || '',
        customChains: [
            {
                network: 'amoy',
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
        ],
    },
    endpointV2: {
        fuji: '0x6EDCE65403992e310A62460808c4b910D972f10f',
    },
    // layerZero: {
    //     endpointV2: {
    //         'fuji-ava': '0x6EDCE65403992e310A62460808c4b910D972f10f',
    //     },
    // },
    // sourcify: {
    //     enabled: true,
    // },
}

export default config
