import { task, types } from 'hardhat/config'

import { config } from '../../deploy-config'

task('vesting:init', 'Initialize Wancash vesting contract (stable token pool)')
    .addParam('vesting', 'Vesting contract address')
    .addParam('token', 'WCH token address')
    .addParam('usdt', 'Stable token address (USDT/BUSD)')
    .addOptionalParam('pool', 'Pancake V3 pool address (WCH/Stable)')
    .addOptionalParam('pair', 'Legacy alias for --pool', undefined, types.string)
    .addOptionalParam('factory', 'Pancake V3 factory address', undefined, types.string)
    .addOptionalParam('fee', 'Pool fee for auto-resolve (e.g. 500, 2500, 10000)', undefined, types.int)
    .addParam('treasury', 'Treasury address')
    .addOptionalParam('allocation', 'Total allocation (human units, default: total - owner)', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        await hre.run('compile')

        const [signer] = await hre.ethers.getSigners()
        const chainId = await hre.ethers.provider.getNetwork().then((n) => n.chainId)
        if (chainId === 31337) {
            throw new Error('This task must be run on a real network, not Hardhat Network')
        }

        const vesting = await hre.ethers.getContractAt('WancashVesting', taskArgs.vesting, signer)

        // Preflight validation: stable token should be ERC20
        const erc20Abi = ['function symbol() view returns (string)']
        try {
            const stable = await hre.ethers.getContractAt(erc20Abi, taskArgs.usdt, signer)
            // Will throw if not an ERC20 (e.g. router address)
            await stable.symbol()
        } catch (error) {
            throw new Error(`Stable token address is not ERC20 or invalid: ${taskArgs.usdt}`)
        }

        const tokenAddr = String(taskArgs.token).toLowerCase()
        const stableAddr = String(taskArgs.usdt).toLowerCase()

        let poolAddress: string | undefined = taskArgs.pool || taskArgs.pair
        if (!poolAddress) {
            if (!taskArgs.factory || taskArgs.fee == null) {
                throw new Error('Pool address is required. Provide --pool or set --factory and --fee.')
            }
            const factory = await hre.ethers.getContractAt(
                ['function getPool(address,address,uint24) view returns (address)'],
                taskArgs.factory,
                signer
            )
            const resolved = await factory.getPool(taskArgs.token, taskArgs.usdt, taskArgs.fee)
            if (resolved === hre.ethers.constants.AddressZero) {
                throw new Error('Pool not found. Create liquidity first or verify fee.')
            }
            poolAddress = resolved
            console.log(`Resolved pool: ${poolAddress}`)
        }
        if (!poolAddress) {
            throw new Error('Pool address is required.')
        }

        const pairAbi = ['function token0() view returns (address)', 'function token1() view returns (address)']
        let token0: string
        let token1: string
        try {
            const pool = await hre.ethers.getContractAt(pairAbi, poolAddress, signer)
            ;[token0, token1] = await Promise.all([pool.token0(), pool.token1()])
        } catch (error) {
            throw new Error(`Pool address is not a Pancake V3 pool or invalid: ${poolAddress}`)
        }

        const token0Lower = token0.toLowerCase()
        const token1Lower = token1.toLowerCase()

        const pairMatches =
            (token0Lower === tokenAddr && token1Lower === stableAddr) ||
            (token0Lower === stableAddr && token1Lower === tokenAddr)

        if (!pairMatches) {
            throw new Error(`Pool mismatch: token0=${token0}, token1=${token1}`)
        }

        const decimals = config.token.decimals
        const total = hre.ethers.utils.parseUnits(config.token.initialSupply, decimals)
        const ownerAlloc = hre.ethers.utils.parseUnits(config.token.ownerAllocation, decimals)
        const defaultAllocation = total.sub(ownerAlloc)

        const allocation = taskArgs.allocation
            ? hre.ethers.utils.parseUnits(taskArgs.allocation, decimals)
            : defaultAllocation

        console.log(`Network: ${hre.network.name}`)
        console.log(`Signer: ${signer.address}`)
        console.log(`Vesting: ${taskArgs.vesting}`)
        console.log(`Token: ${taskArgs.token}`)
        console.log(`USDT: ${taskArgs.usdt}`)
        console.log(`Pool: ${poolAddress}`)
        console.log(`Treasury: ${taskArgs.treasury}`)
        console.log(`Allocation: ${allocation.toString()}`)

        const tx = await vesting.initialize(
            taskArgs.token,
            taskArgs.usdt,
            poolAddress,
            taskArgs.treasury,
            allocation.toString()
        )

        console.log(`Tx hash: ${tx.hash}`)
        await tx.wait()
        console.log('Vesting initialized ✅')
    })
