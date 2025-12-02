import { task } from 'hardhat/config'

import { CI_BSC, INITIAL_SUPPLY, contractName, contractSymbol } from '..'

task('verify:root', 'Verifies contract on Rootstock')
    .addParam('address', 'Contract address')
    .setAction(async (taskArgs, hre) => {
        // Get the same deployment data used during deploy
        const endpointV2Deployment = await hre.deployments.get('EndpointV2')
        const { deployer } = await hre.getNamedAccounts()

        await hre.run('verify:verify', {
            network: 'rootstock',
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
