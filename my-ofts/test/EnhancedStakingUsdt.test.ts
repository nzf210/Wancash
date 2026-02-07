import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('EnhancedStakingUsdt', function () {
    it('stakes and claims rewards', async function () {
        const [owner, user] = await ethers.getSigners()

        const MockToken = await ethers.getContractFactory('MockUSDT')
        const usdt = await MockToken.deploy()
        const wanc = await MockToken.deploy()
        await usdt.deployed()
        await wanc.deployed()

        const Staking = await ethers.getContractFactory('EnhancedStakingUsdt')
        const staking = await Staking.deploy(usdt.address, wanc.address, owner.address)
        await staking.deployed()

        // fund user and contract for rewards
        await usdt.mint(user.address, ethers.utils.parseUnits('1000', 18))
        await usdt.mint(staking.address, ethers.utils.parseUnits('1000', 18))
        await wanc.mint(staking.address, ethers.utils.parseUnits('1000', 18))

        const amount = ethers.utils.parseUnits('10', 18)
        await usdt.connect(user).approve(staking.address, amount)

        await staking.connect(user).stake(amount, 7 * 24 * 60 * 60, owner.address)

        await ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60])
        await ethers.provider.send('evm_mine', [])

        const userUsdtBefore = await usdt.balanceOf(user.address)
        const userWancBefore = await wanc.balanceOf(user.address)

        await staking.connect(user).claim(1)

        const userUsdtAfter = await usdt.balanceOf(user.address)
        const userWancAfter = await wanc.balanceOf(user.address)

        expect(userUsdtAfter.gt(userUsdtBefore)).to.be.true
        expect(userWancAfter.gt(userWancBefore)).to.be.true
    })
})
