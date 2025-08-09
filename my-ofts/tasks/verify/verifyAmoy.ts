import { task } from 'hardhat/config'

import { CI_BSC } from '..'

task('verify:amoy', 'Verifies contract on Polygon Amoy')
    .addParam('address', 'Contract address')
    .setAction(async (taskArgs, hre) => {
        // Get the same deployment data used during deploy
        const endpointV2Deployment = await hre.deployments.get('EndpointV2')
        const { deployer } = await hre.getNamedAccounts()

        await hre.run('verify:verify', {
            network: 'polygon',
            address: taskArgs.address,
            constructorArguments: [
                'Wancash', // name
                'WCH', // symbol
                endpointV2Deployment.address, // LayerZero's EndpointV2 address
                deployer, // owner
                CI_BSC, // main chain
                1034000000, // initial supply
            ],
        })
    })
