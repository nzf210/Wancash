import { task } from 'hardhat/config'

import { CI_BSC, INITIAL_SUPPLY, OWNER_ALLOCATION, contractName, contractSymbol } from '..'

task('verify:arb', 'Verifies contract on Polygon Amoy')
    .addParam('address', 'Contract address')
    .setAction(async (taskArgs, hre) => {
        // Get the same deployment data used during deploy
        const endpointV2Deployment = await hre.deployments.get('EndpointV2')
        const { deployer } = await hre.getNamedAccounts()

        const vestingContract = process.env.VESTING_CONTRACT || deployer

        await hre.run('verify:verify', {
            address: taskArgs.address,
            constructorArguments: [
                contractName, // name
                contractSymbol, // symbol
                endpointV2Deployment.address, // LayerZero's EndpointV2 address
                // process.env.ENDPOINT_LZ,
                deployer, // owner
                deployer, // treasury
                CI_BSC, // main chain
                INITIAL_SUPPLY, // initial supply
                OWNER_ALLOCATION, // owner allocation
                vestingContract, // vesting contract
            ],
        })
    })
