import { task, types } from 'hardhat/config'

task('vesting:resolve-pool', 'Resolve Pancake V3 pool address from token + stable + fee')
    .addParam('token', 'WCH token address')
    .addParam('stable', 'Stable token address (USDT/BUSD)')
    .addParam('fee', 'Pool fee (e.g. 500, 2500, 10000)', undefined, types.int)
    .addParam('factory', 'Pancake V3 factory address')
    .setAction(async (taskArgs, hre) => {
        await hre.run('compile')

        const [signer] = await hre.ethers.getSigners()

        const factory = await hre.ethers.getContractAt(
            ['function getPool(address,address,uint24) view returns (address)'],
            taskArgs.factory,
            signer
        )
        const pool = await factory.getPool(taskArgs.token, taskArgs.stable, taskArgs.fee)
        if (pool === hre.ethers.constants.AddressZero) {
            throw new Error('Pool not found. Create liquidity first or verify fee.')
        }

        const poolAbi = ['function token0() view returns (address)', 'function token1() view returns (address)']
        const poolContract = await hre.ethers.getContractAt(poolAbi, pool, signer)
        const [token0, token1] = await Promise.all([poolContract.token0(), poolContract.token1()])

        const tokenAddr = String(taskArgs.token).toLowerCase()
        const stableAddr = String(taskArgs.stable).toLowerCase()
        const token0Lower = token0.toLowerCase()
        const token1Lower = token1.toLowerCase()

        const matches =
            (token0Lower === tokenAddr && token1Lower === stableAddr) ||
            (token0Lower === stableAddr && token1Lower === tokenAddr)
        if (!matches) {
            throw new Error(`Pool mismatch: token0=${token0}, token1=${token1}`)
        }

        console.log(pool)
    })
