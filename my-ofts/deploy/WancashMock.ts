import assert from 'assert'

import { ethers } from 'ethers'
import { type DeployFunction } from 'hardhat-deploy/types'

import { CI_BSC } from '../tasks'

const contractName = 'WancashMock'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const tokenConfig = {
        name: 'Wancash',
        symbol: 'WCH',
        decimals: 18, // Standard ERC20 decimal
        initialSupply: 2100, // Jumlah token dalam unit biasa (bukan wei)
    }

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // Conver initial supply to wei
    const initialSupplyWei = ethers.utils.parseUnits(tokenConfig.initialSupply.toString(), tokenConfig.decimals)
    const endpointV2Deployment = (await hre.deployments.get('EndpointV2')).address

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            tokenConfig.name,
            tokenConfig.symbol,
            endpointV2Deployment,
            deployer,
            CI_BSC, // main chain
            initialSupplyWei, // Menggunakan nilai yang sudah dikonversi
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
