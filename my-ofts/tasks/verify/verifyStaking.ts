import { task } from 'hardhat/config'
import { boolean, string } from 'hardhat/internal/core/params/argumentTypes'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

interface VerifyArgs {
    address: string
    token: string
    changeable: boolean
}

task('verify:staking', 'Verify EnhancedStaking contract on Etherscan')
    .addParam('address', 'Deployed contract address', undefined, string)
    .addParam('token', 'Staking token address', undefined, string)
    .addParam('changeable', 'Whether token is changeable (true/false)', undefined, boolean)
    .setAction(async (taskArgs: VerifyArgs, hre: HardhatRuntimeEnvironment) => {
        const { address, token, changeable } = taskArgs
        const { ethers, network } = hre

        console.log(`\n🔍 Starting verification for contract at ${address}`)
        console.log(`📌 Network: ${network.name}`)
        console.log(`📊 Staking: ${address}`)
        console.log(`🪙  OFT Token: ${token}`)
        console.log(`🔄 Token Changeable: ${changeable}`)

        // Validasi alamat
        if (!ethers.utils.isAddress(address)) {
            throw new Error(`Invalid contract address: ${address}`)
        }

        if (!ethers.utils.isAddress(token)) {
            throw new Error(`Invalid token address: ${token}`)
        }

        try {
            console.log('\n⏳ Verifying contract...')

            // Tunggu beberapa detik untuk memastikan kontrak terindex
            await new Promise((resolve) => setTimeout(resolve, 15000))

            await hre.run('verify:verify', {
                address: taskArgs.address,
                constructorArguments: [taskArgs.token, true],
            })

            console.log('\n✅ Verification successful!')
            console.log(`🌐 Check on block explorer: https://${network.name}.etherscan.io/address/${address}#code`)
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('already verified')) {
                    console.log('ℹ️ Contract is already verified')
                } else {
                    console.error('\n❌ Verification failed:', error.message)
                    console.log('💡 Tips:')
                    console.log('- Pastikan alamat kontrak dan parameter benar')
                    console.log('- Tunggu beberapa blok setelah deployment sebelum verifikasi')
                    console.log('- Periksa API key Etherscan di hardhat.config.js')
                    throw error
                }
            }
        }
    })

// Task untuk deployment + verifikasi otomatis
task('staking:full-deploy', 'Deploy and verify EnhancedStaking')
    .addParam('token', 'Staking token address', undefined, string)
    .addOptionalParam('changeable', 'Allow token changes', true, boolean)
    .addOptionalParam('verify', 'Auto-verify on Etherscan', false, boolean)
    .setAction(async (taskArgs, hre) => {
        const { token, changeable, verify } = taskArgs

        console.log('\n🚀 Starting deployment...')
        const EnhancedStaking = await hre.ethers.getContractFactory('EnhancedStaking')
        const staking = await EnhancedStaking.deploy(token, changeable)

        await staking.deployed()
        console.log(`✅ Contract deployed at: ${staking.address}`)

        if (verify) {
            // Tunggu 30 detik sebelum verifikasi
            console.log('\n⌛ Waiting for contract propagation...')
            await new Promise((resolve) => setTimeout(resolve, 30000))

            await hre.run('verify:staking', {
                address: staking.address,
                token: token,
                changeable: changeable,
            })
        }

        return {
            address: staking.address,
            token: token,
            changeable: changeable,
        }
    })
