import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

import { CI_BSC, INITIAL_SUPPLY, contractName, contractSymbol } from '../tasks'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // Define main chain ID (misalnya Ethereum Mainnet = 1)
    const MAIN_CHAIN_ID = CI_BSC // Ganti dengan chain ID mainnet Anda

    // Tentukan apakah ini main chain atau bukan
    const isMainChain = hre.network.config.chainId === MAIN_CHAIN_ID

    // Tentukan initial supply (hanya di main chain)
    const SUPPLY = isMainChain ? INITIAL_SUPPLY : '0' // 21,000,000.000 tokens dengan 18 decim

    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            contractName, // name
            contractSymbol, // symbol
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner,
            MAIN_CHAIN_ID, // main chain
            SUPPLY, // initial supply
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
