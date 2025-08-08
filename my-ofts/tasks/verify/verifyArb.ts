import { task } from 'hardhat/config'

task('verify:arb', 'Verifies contract on Polygon Amoy')
    .addParam('address', 'Contract address')
    .setAction(async (taskArgs, hre) => {
        // Get the same deployment data used during deploy
        // const endpointV2Deployment = await hre.deployments.get('EndpointV2')
        const { deployer } = await hre.getNamedAccounts()

        await hre.run('verify:verify', {
            network: 'sepolia-arb',
            address: taskArgs.address,
            constructorArguments: [
                'MyOFT', // name
                'MOFT', // symbol
                // endpointV2Deployment.address, // LayerZero's EndpointV2 address
                process.env.ENDPOINT_LZ,
                deployer, // owner
                97, // main chain
                1034000000, // initial supply
            ],
        })
    })
