import { task } from 'hardhat/config'

import { CI_BSC, INITIAL_SUPPLY, contractName, contractSymbol } from '..'

task('verify:fuji', 'Verifies contract on Fuji Ava')
    .addParam('address', 'Contract address')
    .setAction(async (taskArgs, hre) => {
        // Get the same deployment data used during deploy
        const endpointV2Deployment = await hre.deployments.get('EndpointV2')
        const { deployer } = await hre.getNamedAccounts()
        console.log(`Verifying contract on Fuji: ${taskArgs.address} ${endpointV2Deployment.address} ${deployer}`)
        await hre.run('verify:verify', {
            network: 'fuji',
            address: taskArgs.address,
            constructorArguments: [
                contractName, // name
                contractSymbol, // symbol
                endpointV2Deployment.address, // LayerZero's EndpointV2 address
                deployer, // owner
                CI_BSC, // main chain
                INITIAL_SUPPLY, // initial supply
            ],
        })
    })
