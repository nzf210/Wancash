import { task } from 'hardhat/config'

import { type WancashMock, WancashMock__factory } from '../../types/index'

task('lz:oft:approve', 'Approve token for staking')
    .addParam('spender', 'contract OFT address staking')
    .addOptionalParam('token', 'token contract address', '0x1A3c41392caF81aa7281EFaADC73C653064D22A1')
    .addOptionalParam('amount', 'amount of tokens to approve (e.g., 200 for 200 tokens)', '1000')
    .setAction(async (taskArgs, hre) => {
        await hre.run('compile')

        const { ethers } = hre
        const [signer] = await ethers.getSigners()

        const chainId = await ethers.provider.getNetwork().then((n) => n.chainId)
        console.log('ChainId: ', chainId)

        if (chainId === 31337) {
            throw new Error('This task must be run not on Hardhat Network')
        }

        console.log(`Signer: ${signer.address}`)
        console.log(`Spender Address: ${taskArgs.address}`)
        console.log(`Token Address: ${taskArgs.token}`)
        console.log(`Amount to approve: ${taskArgs.amount} tokens`)

        // ✅ Connect ke token contract (bukan ke staking contract)
        // GANTI DENGAN ALAMAT KONTRAK WancashMock ANDA YANG SEBENARNYA
        const OFT_CONTRACT_ADDRESS = taskArgs.token // ← ALAMAT KONTRAK TOKEN WancashMock

        const tokenContract: WancashMock = WancashMock__factory.connect(OFT_CONTRACT_ADDRESS, signer)

        // ✅ Convert amount human-readable ke wei (18 decimals)
        const amountInWei = ethers.utils.parseUnits(taskArgs.amount, 18)
        console.log(`Amount in wei: ${amountInWei.toString()}`)

        // ✅ Lakukan approve ke staking contract untuk spending token
        const tx = await tokenContract.approve(taskArgs.spender, amountInWei)
        await tx.wait() // Tunggu konfirmasi transaksi

        console.log(`✅ Approved ${taskArgs.amount} WancashMock tokens for staking contract at ${tx.hash}`)
        console.info('Waiting for transaction confirmation...')
        console.info(`explorer: https://testnet.bscscan.com/tx/${tx.hash}`)
        console.log('Transaction confirmed ✅\n')
    })
