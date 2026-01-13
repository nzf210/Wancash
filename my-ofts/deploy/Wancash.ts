import assert from 'assert'
import { ethers } from 'ethers'
import { type DeployFunction } from 'hardhat-deploy/types'
import { config } from '../deploy-config'

const deploy: DeployFunction = async (hre) => {
    // Only run this script if we are in 'prod' mode and deploying 'Wancash'
    if (config.contractName !== 'Wancash') {
        return;
    }

    const { getNamedAccounts, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // Define main chain ID (e.g. BSC Mainnet = 56, Testnet = 97)
    // We assume the first network in our list is the "Main Chain" for minting
    // or you can configure this explicitly. For now, let's look at the config.networks[0] 
    // but that's a name. 
    // Safer to check chainId from hre.

    // For Wancash (Prod), we essentially want to mint on one specific chain.
    // Let's assume BSC is our "Home" chain.
    const BSC_CHAIN_ID = 56;
    const BSC_TESTNET_CHAIN_ID = 97;

    // We determine MAIN_CHAIN_ID based on configs or env.
    const MAIN_CHAIN_ID = config.mode === process.env.MODE ? BSC_CHAIN_ID : BSC_TESTNET_CHAIN_ID;

    const isMainChain = hre.network.config.chainId === MAIN_CHAIN_ID

    // Parse initial supply
    let supply = '0';
    if (isMainChain) {
        supply = ethers.utils.parseUnits(config.token.initialSupply, config.token.decimals).toString();
    }

    let endpointV2Address: string;
    try {
        const endpointV2Deployment = await hre.deployments.get('EndpointV2')
        endpointV2Address = endpointV2Deployment.address
    } catch (error) {
        // Fallback to standard LayerZero V2 Endpoint address (same for most EVM chains: Mainnet & Testnet)
        // Verify this for non-standard chains (like ZK chains), but standard EVMs use this.
        endpointV2Address = '0x1a44076050125825900e588151d303302910f840'
        console.warn(`⚠️  EndpointV2 deployment not found. Using standard address: ${endpointV2Address}`)
    }

    const { address } = await deploy(config.contractName, {
        from: deployer,
        args: [
            config.token.name,
            config.token.symbol,
            endpointV2Address, // LayerZero's EndpointV2 address
            deployer, // owner,
            MAIN_CHAIN_ID, // main chain
            supply, // initial supply
        ],
        log: true,
        skipIfAlreadyDeployed: true, // In prod, we usually don't want to redeploy easily
    })

    console.log(`Deployed contract: ${config.contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = ['Wancash']
export default deploy
