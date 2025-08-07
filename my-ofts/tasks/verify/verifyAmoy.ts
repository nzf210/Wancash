import { task } from 'hardhat/config'

task('verify:amoy', 'Verifies contract on Polygon Amoy')
    .addParam('address', 'Contract address')
    .setAction(async (taskArgs, hre) => {
        // Get the same deployment data used during deploy
        const endpointV2Deployment = await hre.deployments.get('EndpointV2')
        const { deployer } = await hre.getNamedAccounts()

        await hre.run('verify:verify', {
            network: 'amoy',
            address: taskArgs.address,
            constructorArguments: [
                'MyOFT', // name
                'MOFT', // symbol
                endpointV2Deployment.address, // LayerZero's EndpointV2 address
                deployer, // owner
                97, // main chain
                1034000000, // initial supply
            ],
        })
    })
