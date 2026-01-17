import 'dotenv/config'

// MODE SELECTION: 'dev' or 'prod'
// Automatically determined by .env variable MODE. 
// MODE='main' -> 'prod' (Mainnet)
// MODE='test' (or anything else) -> 'dev' (Testnet)
const currentMode = process.env.MODE === 'main' ? 'prod' : 'dev';

// Token Configuration
const tokenConfig = {
    name: 'Wancash',
    symbol: 'WCH',
    initialSupply: '2100000000', // 21 Million
    decimals: 18,
};

// Network Configurations
const testnets = [
    'bsc',       // BSC Testnet
    'polygon',   // Amoy
    'ethereum',  // Sepolia
    'avalance',  // Fuji
    'rootstock', // Rootstock Testnet
    'arbitrum',  // Arbitrum Sepolia
];

const mainnets = [
    'bsc',       // BSC Mainnet
    'polygon',   // Polygon Mainnet
    'ethereum',  // Ethereum Mainnet
    'avalance',  // Avalanche Mainnet
    'rootstock', // Rootstock Mainnet
    'arbitrum',  // Arbitrum Mainnet
];

export const config = {
    mode: currentMode,

    // Derived configuration
    contractName: currentMode === 'prod' ? 'Wancash' : 'WancashMock',
    networks: currentMode === 'prod' ? mainnets : testnets,

    // Environment variable value for hardhat.config.ts (MODE=main triggers prod config)
    envMode: currentMode === 'prod' ? 'main' : 'test',

    token: tokenConfig,

    // Enable auto-verification after deployment
    verify: true,

    // Enable auto-wiring (LayerZero peer setting) after deployment
    wire: true,

    // LayerZero configuration path
    lzConfigPath: './layerzero.config.ts',

    // Environment variable mapping for synchronization
    // Source (my-ofts/.env) -> Target (my-frontend/.env)
    envMapping: {
        TEST_SC_BSC: ['WCH_TOKEN_BSC'],
        BSC_CONTRACT: ['WCH_TOKEN_BSC_TEST'],
        POLY_CONTRACT: ['WCH_TOKEN_POLYGON', 'WCH_TOKEN_POLYGON_AMOY'],
        ETH_CONTRACT: ['WCH_TOKEN_ETHEREUM', 'WCH_TOKEN_ETHEREUM_SEPOLIA'],
        AVA_CONTRACT: ['WCH_TOKEN_AVALANCHE', 'WCH_TOKEN_AVALANCHE_FUJI'],
        ARB_CONTRACT: ['WCH_TOKEN_ARBITRUM', 'WCH_TOKEN_ARBITRUM_SEPOLIA'],
        ROOT_CONTRACT: ['WCH_TOKEN_ROOTSTOCK'],
        BSC_RPC_URL: ['BSC_RPC_URL'],
        BSC_TEST_RPC_URL: ['BSC_TEST_RPC_URL'],
        POLYGON_RPC_URL: ['POLYGON_RPC_URL'],
        POLYGON_AMOY_RPC_URL: ['POLYGON_AMOY_RPC_URL'],
        ETHEREUM_RPC_URL: ['ETHEREUM_RPC_URL'],
        ETHEREUM_SEPOLIA_RPC_URL: ['ETHEREUM_SEPOLIA_RPC_URL'],
        ARBITRUM_RPC_URL: ['ARBITRUM_RPC_URL'],
        ARBITRUM_SEPOLIA_RPC_URL: ['ARBITRUM_SEPOLIA_RPC_URL'],
        AVALANCHE_RPC_URL: ['AVALANCHE_RPC_URL'],
        AVALANCHE_FUJI_RPC_URL: ['AVALANCHE_FUJI_RPC_URL'],
        TELEGRAM_BOT_TOKEN: ['TELEGRAM_BOT_TOKEN'],
        TELEGRAM_CHAT_ID_ERROR: ['TELEGRAM_CHAT_ID_ERROR'],
        TELEGRAM_CHAT_ID_REDEMPTION: ['TELEGRAM_CHAT_ID_REDEMPTION'],
        TELEGRAM_CHAT_ID_BRIDGE: ['TELEGRAM_CHAT_ID_BRIDGE'],
        TELEGRAM_CHAT_ID_SEND_TRX: ['TELEGRAM_CHAT_ID_SEND_TRX'],
        TELEGRAM_CHAT_ID_SUPPORT: ['TELEGRAM_CHAT_ID_SUPPORT'],
        EXPLORER_URL_SEPOLIA: ['EXPLORER_URL_SEPOLIA'],
        EXPLORER_URL_FUJI: ['EXPLORER_URL_FUJI'],
        EXPLORER_URL_BSC: ['EXPLORER_URL_BSC'],
        LZ_SCAN_URL: ['LZ_SCAN_URL'],
        MORALIS_API_KEY: ['MORALIS_API_KEY'],
        MORALIS_URL: ['MORALIS_URL'],
        PANCAKESWAP_ROUTER: ['PANCAKESWAP_ROUTER'],
        WHITEPAPER_URL: ['WHITEPAPER_URL'],
        APP_URL: ['APP_URL'],

    }
}
