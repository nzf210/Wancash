import { BigNumber } from 'ethers'
import { task } from 'hardhat/config'

import { type EnhancedStakingUsdt, EnhancedStakingUsdt__factory } from '../../types/index'

task('lz:stk:address', 'get user address for staking')
    .addParam('contract', 'staking contract address') // ✅ Ganti nama parameter jadi lebih jelas
    .addOptionalParam('user', 'user address to check', '') // ✅ Parameter opsional untuk user address
    .setAction(async (taskArgs, hre) => {
        await hre.run('compile')

        const { ethers } = hre
        const [signer] = await ethers.getSigners()

        const chainId = await ethers.provider.getNetwork().then((n) => n.chainId)
        console.log('ChainId: ', chainId)

        if (chainId === 31337) {
            throw new Error('This task must be run not on Hardhat Network')
        }

        // ✅ Tentukan user address (gunakan parameter atau signer)
        const userAddress = taskArgs.user || signer.address
        console.log(`Staking Contract: ${taskArgs.contract}`)
        console.log(`User Address: ${userAddress}`)
        console.log(`Signer: ${signer.address}`)

        try {
            // ✅ Connect ke staking contract
            const stakingContract: EnhancedStakingUsdt = EnhancedStakingUsdt__factory.connect(taskArgs.contract, signer)

            // ✅ 1. Pertama, cek apakah kontrak memang memiliki function getUserStakes
            console.log('Checking if contract has getUserStakes function...')

            // ✅ 2. Coba baca beberapa value dasar dulu untuk verifikasi
            try {
                const owner = await stakingContract.owner()
                console.log(`✅ Contract owner: ${owner}`)
            } catch (e) {
                console.log('ℹ️  Cannot read owner - might not be the right contract')
            }

            // ✅ 3. Coba panggil getUserStakes
            console.log('Calling getUserStakes...')
            const userStakes: BigNumber | BigNumber[] = await stakingContract.getUserStakes(userAddress)

            console.log('✅ User stakes retrieved successfully:')
            console.log(`Raw result: ${userStakes}`)

            // ✅ 4. Format output berdasarkan tipe data yang diharapkan
            // Asumsi: getUserStakes mengembalikan tuple atau struct
            if (Array.isArray(userStakes)) {
                userStakes.forEach((stake: BigNumber, index: number, array: BigNumber[]) => {
                    console.log(`  [${index}]: ${stake.toString()}`)
                })
            } else {
                console.log(`User Stakes: ${userStakes}`) // or handle the unknown type
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('❌ Error details:')
                console.error(`Error message: ${error.message}`)
            } else {
                // ✅ Berikan saran troubleshooting

                console.log('\n🔍 Troubleshooting suggestions:')
                console.log('1. Pastikan alamat kontrak benar: EnhancedStakingUsdt')
                console.log('2. Pastikan function getUserStakes ada di kontrak')
                console.log('3. Cek ABI yang digunakan sesuai dengan kontrak yang terdeploy')
                console.log('4. Verifikasi kontrak di BscScan untuk melihat function yang available')
            }

            throw error // Re-throw error setelah logging
        }

        console.log('Task completed ✅\n')
    })
