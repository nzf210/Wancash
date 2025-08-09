import { task } from 'hardhat/config'

import { NETWORK_CONFIG } from './send/sendOFT'

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
