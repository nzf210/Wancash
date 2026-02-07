import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('EnhancedStaking', function () {
    it('allows stake and unstake after lock with rewards', async function () {
        const [_owner, user] = await ethers.getSigners()

        const USDT = await ethers.getContractFactory('MockUSDT')
        const token = await USDT.deploy()
        await token.deployed()

        const Staking = await ethers.getContractFactory('EnhancedStaking')
        const staking = await Staking.deploy(token.address, true)
        await staking.deployed()

        // fund user and staking contract for rewards
        await token.mint(user.address, ethers.utils.parseUnits('1000', 18))
        await token.mint(staking.address, ethers.utils.parseUnits('100', 18))

        const amount = ethers.utils.parseUnits('1', 18)
        await token.connect(user).approve(staking.address, amount)

        await staking.connect(user).stake(1, 0) // 1 token, 3 months lock

        await ethers.provider.send('evm_increaseTime', [90 * 24 * 60 * 60])
        await ethers.provider.send('evm_mine', [])

        const before = await token.balanceOf(user.address)
        await staking.connect(user).unstake()
        const after = await token.balanceOf(user.address)

        expect(after.gt(before)).to.be.true
    })
})
