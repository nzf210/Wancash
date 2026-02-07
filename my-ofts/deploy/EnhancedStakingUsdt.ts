// File: scripts/deploy-staking.ts

import assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'

import { ethers } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

/**
 *
interface DeploymentInfo {
    contractName: string
    contractAddress: string
    stakingToken: string
    deployer: string
    network: string
    deploymentTime: string
    transactionHash: string
    lockOptions: Array<{
        period: string
        duration: string
        reward: string
    }>
}
*/

const contractName = 'EnhancedStakingUsdt'
const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')
    console.log('🚀 Starting Enhanced Staking Contract Deployment...\n')

    console.log('🌐 Network Info:')
    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)
    console.log(`Chain ID: ${hre.network.config.chainId}\n`)

    const chainId = hre.network.config.chainId

    if (chainId === 31337) {
        console.log('🚨 Hardhat Network Detected. Skipping deployment...\n')
        throw new Error('This task must be run on a real network, not Hardhat Network')
    }

    // Configuration - change these values as needed
    const oft_token = process.env.BSC_CONTRACT || '' // Replace with your token address
    const usdt_token = process.env.BSC_USDT_CONTRACT || '' // Replace with your token address
    const verifyContract = true // Set to false if you don't want to verify
    if (!oft_token && !ethers.utils.isAddress(oft_token) && !usdt_token) {
        throw new Error('❌ No token address provided or invalid address')
    }

    console.log('🪙 USDT Token Address:', usdt_token)
    console.log('🪙 Staking Token Address:', oft_token)

    try {
        const { address } = await deploy(contractName, {
            from: deployer,
            args: [
                usdt_token, // token usdt
                oft_token, // oft token
                deployer, // deployer
            ],
            log: true,
            skipIfAlreadyDeployed: false,
        })

        console.log('\n✅ Contract deployed successfully!')
        console.log('📍 Contract Address:', address)

        // Verify contract on Etherscan if requested
        verification(verifyContract, hre, address, oft_token, usdt_token, deployer)

        // Get network information
        const network = await hre.ethers.provider.getNetwork()
        const networkName = network.name === 'unknown' ? 'localhost' : network.name

        // Create deployments directory if it doesn't exist
        const deploymentsDir = path.join(__dirname, '../deployments')
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir)
        }

        // Save deployment info to JSON file
        const deploymentFile = path.join(deploymentsDir, `staking-${networkName}-${Date.now()}.json`)

        console.log('\n📄 Deployment info saved to:', deploymentFile)

        // Display deployment summary
        console.log('\n📄 Deployment Summary:')
        console.log('═══════════════════════════════════════════')
        console.log(`Network: ${networkName}`)
        console.log(`Contract: ${address}`)
        console.log(`Token OFT: ${oft_token}`)
        console.log(`Token USDT: ${usdt_token}`)
        console.log(`Owner: ${deployer}`)

        // Instructions for users
        console.log('\n📋 Next Steps:')
        console.log('1. Make sure your staking token contract approves this contract')
        console.log('2. Users need to approve() their tokens before staking')
        console.log('3. Use setLockOption() to modify reward rates if needed')
        console.log('4. Monitor contract using the view functions')

        console.log('\n🎯 Contract Interface Examples:')
        console.log('// Stake tokens with 1 year lock')
        console.log(`await contract.stake(amount, 2) // 2 = ONE_YEAR`)
        console.log('\n// Check user stake info')
        console.log(`await contract.getStakeInfo(userAddress)`)
        console.log('\n// Emergency unstake (no rewards)')
        console.log(`await contract.emergencyUnstake()`)
        console.log('\n// Normal unstake (with rewards after lock period)')
        console.log(`await contract.unstake()`)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('\n❌ Deployment failed:', error.message)
            process.exit(1)
        } else {
            console.error('\n❌ Deployment failed:', error)
            process.exit(1)
        }
    }
}

deploy.tags = [contractName]

export default deploy

const verification = async (
    verifyContract: boolean,
    hre: HardhatRuntimeEnvironment,
    address_contract: string,
    oft_token: string,
    usdt_token: string,
    deployer: string
) => {
    if (verifyContract) {
        console.log('\n⏳ Verifying contract on Etherscan...')

        // Wait a bit for the contract to be indexed
        console.log('⏱️  Waiting 30 seconds before verification...')
        await new Promise((resolve) => setTimeout(resolve, 30000))

        try {
            await hre.run('verify:verify', {
                address: address_contract,
                constructorArguments: [usdt_token, oft_token, deployer],
            })
            console.log('✅ Contract verified successfully!')
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log('🚨 Error verifying contract:', error.message)
            } else {
                console.log('🚨 Error verifying contract:', error)
            }
        }
    }
}
