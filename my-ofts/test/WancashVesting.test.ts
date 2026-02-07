import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('WancashVesting', function () {
    const MONTH = 30 * 24 * 60 * 60

    it('releases monthly and burns 50% if price drops >20%', async function () {
        const [owner, treasury] = await ethers.getSigners()

        const USDT = await ethers.getContractFactory('MockUSDT')
        const usdt = await USDT.deploy()
        await usdt.deployed()

        const Vesting = await ethers.getContractFactory('WancashVesting')
        const vesting = await Vesting.deploy()
        await vesting.deployed()

        const LZEndpointMockFactory = await ethers.getContractFactory('LZEndpointMock')
        const lzEndpointMock = await LZEndpointMockFactory.deploy()
        await lzEndpointMock.deployed()
        await lzEndpointMock.setDelegate(owner.address)

        const Wancash = await ethers.getContractFactory('Wancash')
        const totalSupply = ethers.utils.parseUnits('999990000', 18)
        const ownerAllocation = ethers.utils.parseUnits('200000000', 18)

        const wch = await Wancash.deploy({
            name: 'Wancash',
            symbol: 'WCH',
            lzEndpoint: lzEndpointMock.address,
            delegate: owner.address,
            treasury: owner.address,
            mainChainId: 31337,
            initialSupply: totalSupply,
            ownerAllocation: ownerAllocation,
            vestingContract: vesting.address
        })
        await wch.deployed()

        const Pool = await ethers.getContractFactory('MockPancakeV3Pool')
        const pool = await Pool.deploy(wch.address, usdt.address)
        await pool.deployed()

        await vesting.initialize(
            wch.address,
            usdt.address,
            pool.address,
            treasury.address,
            totalSupply.sub(ownerAllocation)
        )

        const allocation = await vesting.totalAllocation()
        const monthly = allocation.div(60)

        const tickFromPrice = (price: number) => Math.trunc(Math.log(price) / Math.log(1.0001))

        // Month 1: price stable (1.0)
        const tick1 = tickFromPrice(1)
        await pool.setObservations(0, tick1 * MONTH)
        await ethers.provider.send('evm_increaseTime', [MONTH])
        await ethers.provider.send('evm_mine', [])

        await vesting.release()
        const treasuryBal1 = await wch.balanceOf(treasury.address)
        expect(treasuryBal1.eq(monthly)).to.be.true

        // Month 2: price drops 30% (0.7)
        const tick2 = tickFromPrice(0.7)
        await pool.setObservations(0, tick2 * MONTH)
        await ethers.provider.send('evm_increaseTime', [MONTH])
        await ethers.provider.send('evm_mine', [])

        const totalBefore = await wch.totalSupply()
        await vesting.release()

        const expectedBurn = monthly.div(2)
        const expectedRelease = monthly.sub(expectedBurn)

        const treasuryBal2 = await wch.balanceOf(treasury.address)
        expect(treasuryBal2.eq(monthly.add(expectedRelease))).to.be.true
        const totalAfter = await wch.totalSupply()
        expect(totalAfter.eq(totalBefore.sub(expectedBurn))).to.be.true
    })
})
