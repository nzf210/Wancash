import { task, types } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

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

task('lz:deploy:staking', 'Deploy Enhanced Staking Contract')
    .addParam('token', 'Address of the staking token', undefined, types.string)
    .addOptionalParam('verify', 'Verify contract on etherscan', true, types.boolean)
    .setAction(async (taskArgs: { token: string; verify?: boolean }, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const { formatEther, isAddress } = ethers.utils
        console.log('🚀 Starting Enhanced Staking Contract Deployment...\n')

        // Get deployer account
        const [deployer] = await ethers.getSigners()
        const balance = await ethers.provider.getBalance(deployer.address)

        console.log('📝 Deploying with account:', deployer.address)
        console.log('💰 Account balance:', formatEther(balance), 'ETH\n')

        // Validate token address
        if (!isAddress(taskArgs.token)) {
            throw new Error('❌ Invalid token address provided')
        }

        console.log('🪙 Staking Token Address:', taskArgs.token)

        try {
            // Get contract factory
            const EnhancedStaking = await ethers.getContractFactory('EnhancedStaking')

            console.log('⏳ Deploying contract...')

            // Deploy contract
            const stakingContract = await EnhancedStaking.deploy(taskArgs.token)

            // Wait for deployment
            await stakingContract.waitForDeployment()
            const contractAddress = await stakingContract.getAddress()

            console.log('\n✅ Contract deployed successfully!')
            console.log('📍 Contract Address:', contractAddress)

            const deployTx = stakingContract.deploymentTransaction()
            if (deployTx) {
                console.log('🔗 Transaction Hash:', deployTx.hash)
            }

            // Display lock options
            console.log('\n📊 Default Lock Options:')
            console.log('┌─────────────┬────────────┬─────────────┐')
            console.log('│ Lock Period │ Duration   │ Reward Rate │')
            console.log('├─────────────┼────────────┼─────────────┤')
            console.log('│ 3 Months    │ 90 days    │ 15%         │')
            console.log('│ 6 Months    │ 180 days   │ 35%         │')
            console.log('│ 1 Year      │ 365 days   │ 80%         │')
            console.log('│ 2 Years     │ 730 days   │ 200%        │')
            console.log('│ 3 Years     │ 1095 days  │ 500%        │')
            console.log('└─────────────┴────────────┴─────────────┘')

            // Verify contract on Etherscan if requested
            if (taskArgs.verify) {
                console.log('\n⏳ Verifying contract on Etherscan...')

                // Wait a bit for the contract to be indexed
                console.log('⏱️  Waiting 30 seconds before verification...')
                await new Promise((resolve) => setTimeout(resolve, 30000))

                try {
                    await hre.run('verify:verify', {
                        address: contractAddress,
                        constructorArguments: [taskArgs.token],
                    })
                    console.log('✅ Contract verified successfully!')
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        console.log('🚨 Error verifying contract:', error.message)
                    } else {
                        console.log('⚠️  Verification failed:', error)
                    }
                }
            }

            // Save deployment info
            const deploymentInfo: DeploymentInfo = {
                contractName: 'EnhancedStaking',
                contractAddress: contractAddress,
                stakingToken: taskArgs.token,
                deployer: deployer.address,
                network: hre.network.name,
                deploymentTime: new Date().toISOString(),
                transactionHash: deployTx?.hash || '',
                lockOptions: [
                    { period: '3 Months', duration: '90 days', reward: '15%' },
                    { period: '6 Months', duration: '180 days', reward: '35%' },
                    { period: '1 Year', duration: '365 days', reward: '80%' },
                    { period: '2 Years', duration: '730 days', reward: '200%' },
                    { period: '3 Years', duration: '1095 days', reward: '500%' },
                ],
            }

            console.log('\n📄 Deployment Summary:')
            console.log('═══════════════════════════════════════════')
            console.log(`Network: ${hre.network.name}`)
            console.log(`Contract: ${contractAddress}`)
            console.log(`Token: ${taskArgs.token}`)
            console.log(`Owner: ${deployer.address}`)
            console.log(`Deployed at: ${deploymentInfo.deploymentTime}`)

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

            return {
                contract: stakingContract,
                address: contractAddress,
                deploymentInfo: deploymentInfo,
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message)
                throw error
            } else {
                console.error('\n❌ Deployment failed:', error)
            }
        }
    })

// Additional task for managing lock options
task('ls:set-lock-option', 'Set or update lock option')
    .addParam('contract', 'Address of the staking contract', undefined, types.string)
    .addParam('period', 'Lock period index (0-4)', undefined, types.string)
    .addParam('duration', 'Duration in days', undefined, types.string)
    .addParam('reward', 'Reward rate in percentage', undefined, types.string)
    .setAction(
        async (
            taskArgs: {
                contract: string
                period: string
                duration: string
                reward: string
            },
            hre: HardhatRuntimeEnvironment
        ) => {
            const { ethers } = hre
            const { isAddress } = ethers.utils
            console.log('⚙️  Updating lock option...\n')

            const [owner] = await ethers.getSigners()
            console.log('👤 Owner:', owner.address)

            // Validate inputs
            const periodIndex = parseInt(taskArgs.period)
            const durationDays = parseInt(taskArgs.duration)
            const rewardRate = parseInt(taskArgs.reward)

            if (isNaN(periodIndex) || periodIndex < 0 || periodIndex > 4) {
                throw new Error('❌ Period index must be 0-4')
            }

            if (isNaN(durationDays) || durationDays <= 0) {
                throw new Error('❌ Duration must be greater than 0')
            }

            if (isNaN(rewardRate) || rewardRate <= 0) {
                throw new Error('❌ Reward rate must be greater than 0')
            }

            if (!isAddress(taskArgs.contract)) {
                throw new Error('❌ Invalid contract address')
            }

            // Connect to contract
            const EnhancedStaking = await ethers.getContractFactory('EnhancedStaking')
            const contract = EnhancedStaking.attach(taskArgs.contract)

            // Convert days to seconds
            const durationSeconds = BigInt(durationDays * 24 * 60 * 60)

            console.log('📊 Setting lock option:')
            console.log(`Period Index: ${periodIndex}`)
            console.log(`Duration: ${durationDays} days (${durationSeconds.toString()} seconds)`)
            console.log(`Reward Rate: ${rewardRate}%`)

            try {
                const tx = await contract.setLockOption(periodIndex, durationSeconds, rewardRate)
                console.log('\n⏳ Transaction sent:', tx.hash)

                await tx.wait()
                console.log('✅ Lock option updated successfully!')

                // Verify the update
                const updatedOption = await contract.lockOptions(periodIndex)
                const durationInDays = Number(updatedOption.duration) / (24 * 60 * 60)

                console.log('\n📈 Updated Option:')
                console.log(`Duration: ${updatedOption.duration.toString()} seconds (${durationInDays} days)`)
                console.log(`Reward Rate: ${updatedOption.rewardRate.toString()}%`)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('\n❌ Failed to update lock option:', error.message)
                    throw error
                } else {
                    console.error('\n❌ Failed to update unknown:', error)
                    throw error
                }
            }
        }
    )

// Task to check contract info
task('lz:staking-info', 'Get staking contract information')
    .addParam('contract', 'Address of the staking contract', undefined, types.string)
    .addOptionalParam('user', 'User address to check stake info', undefined, types.string)
    .setAction(
        async (
            taskArgs: {
                contract: string
                user?: string
            },
            hre: HardhatRuntimeEnvironment
        ) => {
            const { ethers } = hre
            const { formatEther, isAddress } = ethers.utils
            console.log('📊 Staking Contract Information\n')

            if (!isAddress(taskArgs.contract)) {
                throw new Error('❌ Invalid contract address')
            }

            const EnhancedStaking = await ethers.getContractFactory('EnhancedStaking')
            const contract = EnhancedStaking.attach(taskArgs.contract)

            try {
                // Get basic contract info
                const stakingToken = await contract.stakingToken()
                const totalStaked = await contract.totalStaked()
                const owner = await contract.owner()

                console.log('🔍 Contract Details:')
                console.log(`Address: ${taskArgs.contract}`)
                console.log(`Owner: ${owner}`)
                console.log(`Staking Token: ${stakingToken}`)
                console.log(`Total Staked: ${formatEther(totalStaked)} tokens`)

                // Get all lock options
                console.log('\n📋 Lock Options:')
                console.log('┌─────────┬─────────────┬─────────────┬─────────────┐')
                console.log('│ Index   │ Period      │ Duration    │ Reward Rate │')
                console.log('├─────────┼─────────────┼─────────────┼─────────────┤')

                const periodNames = ['3 Months', '6 Months', '1 Year', '2 Years', '3 Years']

                for (let i = 0; i < 5; i++) {
                    const option = await contract.lockOptions(i)
                    const durationDays = Number(option.duration) / (24 * 60 * 60)
                    const durationStr = durationDays.toString().padEnd(11)
                    const rewardStr = option.rewardRate.toString()
                    const rewardPadded = `${rewardStr}%${' '.repeat(10 - rewardStr.length)}`

                    console.log(`│ ${i}       │ ${periodNames[i].padEnd(11)} │ ${durationStr} │ ${rewardPadded}│`)
                }
                console.log('└─────────┴─────────────┴─────────────┴─────────────┘')

                // Get user info if provided
                if (taskArgs.user) {
                    if (!isAddress(taskArgs.user)) {
                        console.log('⚠️  Invalid user address provided, skipping user info')
                        return
                    }

                    console.log(`\n👤 User Stake Info (${taskArgs.user}):`)

                    const stakeInfo = await contract.getStakeInfo(taskArgs.user)

                    if (stakeInfo.amount > 0n) {
                        const lockEndDate = new Date(Number(stakeInfo.lockEndTime) * 1000)
                        const startDate = new Date(Number(stakeInfo.startTime) * 1000)

                        console.log(`Amount: ${formatEther(stakeInfo.amount)} tokens`)
                        console.log(`Lock Period: ${periodNames[Number(stakeInfo.lockPeriod)]}`)
                        console.log(`Start Time: ${startDate.toLocaleString()}`)
                        console.log(`Lock End Time: ${lockEndDate.toLocaleString()}`)
                        console.log(`Is Locked: ${stakeInfo.isLocked}`)
                        console.log(`Potential Reward: ${formatEther(stakeInfo.potentialReward)} tokens`)

                        const canUnstake = await contract.canUnstake(taskArgs.user)
                        const remainingTime = await contract.getRemainingLockTime(taskArgs.user)

                        console.log(`Can Unstake: ${canUnstake}`)
                        if (remainingTime > 0n) {
                            const days = Number(remainingTime) / (24 * 60 * 60)
                            console.log(`Remaining Lock Time: ${days.toFixed(2)} days`)
                        }
                    } else {
                        console.log('No active stake found')
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('❌ Failed to get contract info:', error.message)
                } else {
                    console.error('❌ Failed to get contract info:', error)
                }
            }
        }
    )
