import assert from 'assert'

import { ethers } from 'ethers'
import { type DeployFunction } from 'hardhat-deploy/types'

import { config } from '../deploy-config'

const deploy: DeployFunction = async (hre) => {
    // Only run if we are deploying WancashMock
    if (config.contractName !== 'WancashMock') {
        return
    }

    const { getNamedAccounts, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    const endpointV2Deployment = (await hre.deployments.get('EndpointV2')).address

    // For Mock, we might want to mint everywhere or just defined logic.
    // The original script passed mainChainID and supply.
    // Let's stick to simple defaults for Mock:
    // Passing 0 supply and 0 chainId makes it behave standard or flexible?
    // Looking at WancashMock.sol, it takes same args as Wancash.

    // Convert initial supply to wei
    const initialSupplyWei = ethers.utils.parseUnits(config.token.initialSupply, config.token.decimals).toString()
    const ownerAllocationWei = ethers.utils.parseUnits(config.token.ownerAllocation, config.token.decimals).toString()

    const vestingContract = process.env.VESTING_CONTRACT || deployer

    // For Mocks, we often just want deployer to own it and mint freely.
    // We pass current chainId as mainChainId so it mints immediately?
    // Or we pass 0 and rely on manual minting.
    // Given WancashMock has `mint()` function exposed, we can mint later.
    // Let's pass 0 supply in constructor to avoid "only mint on main chain" logic restriction if we want flexibility,
    // or pass current chainID to force minting.

    // Let's stick to original behavior:
    const CI_BSC = 97 // hardcoded in original script import
    const mainChainId = CI_BSC

    const { address } = await deploy(config.contractName, {
        from: deployer,
        args: [
            config.token.name,
            config.token.symbol,
            endpointV2Deployment,
            deployer,
            deployer,
            mainChainId,
            initialSupplyWei,
            ownerAllocationWei,
            vestingContract,
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${config.contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = ['WancashMock']

export default deploy
