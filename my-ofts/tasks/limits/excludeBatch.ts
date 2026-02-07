import { task, types } from 'hardhat/config'

task('lz:limits:exclude-batch', 'Batch update excluded-from-limits list')
    .addParam('contract', 'Wancash/WancashMock contract address')
    .addParam('accounts', 'Comma-separated list of addresses', undefined, types.string)
    .addOptionalParam('excluded', 'Set excluded flag (true/false)', true, types.boolean)
    .setAction(async (taskArgs, hre) => {
        await hre.run('compile')

        const [signer] = await hre.ethers.getSigners()
        const chainId = await hre.ethers.provider.getNetwork().then((n) => n.chainId)

        if (chainId === 31337) {
            throw new Error('This task must be run on a real network, not Hardhat Network')
        }

        const accounts = String(taskArgs.accounts)
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean)

        if (accounts.length === 0) {
            throw new Error('No accounts provided. Use --accounts "0xabc...,0xdef..."')
        }

        for (const account of accounts) {
            if (!hre.ethers.utils.isAddress(account)) {
                throw new Error(`Invalid address: ${account}`)
            }
        }

        console.log(`Network: ${hre.network.name}`)
        console.log(`Chain ID: ${chainId}`)
        console.log(`Signer: ${signer.address}`)
        console.log(`Contract: ${taskArgs.contract}`)
        console.log(`Excluded: ${taskArgs.excluded}`)
        console.log(`Accounts (${accounts.length}): ${accounts.join(', ')}`)

        const wancash = await hre.ethers.getContractAt('Wancash', taskArgs.contract, signer)
        const tx = await wancash.setBatchExcludedFromLimits(accounts, taskArgs.excluded)

        console.log(`Tx hash: ${tx.hash}`)
        await tx.wait()
        console.log('Batch update confirmed ✅')
    })
