
import { expect } from "chai";
import { ethers } from "hardhat";
import { Wancash, LZEndpointMock } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Wancash Enhanced Features", function () {
    let wancash: Wancash;
    let lzEndpointMock: LZEndpointMock;
    let owner: SignerWithAddress;
    let treasury: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let pair: SignerWithAddress;

    const INITIAL_SUPPLY = ethers.utils.parseEther("1000000"); // 1M tokens

    // Helper to check revert without chai matchers
    async function expectRevert(promise: Promise<any>, expectedMessage?: string) {
        try {
            await promise;
        } catch (error: any) {
            if (expectedMessage) {
                if (!error.message.includes(expectedMessage)) {
                    // Sometimes the error is nested
                    if (!JSON.stringify(error).includes(expectedMessage)) {
                        throw new Error(`Expected revert with "${expectedMessage}", but got: ${error.message || error}`);
                    }
                }
            }
            return;
        }
        throw new Error("Expected transaction to revert, but it succeeded");
    }

    beforeEach(async function () {
        [owner, treasury, user1, user2, pair] = await ethers.getSigners();

        // Deploy Mock Endpoint
        const LZEndpointMockFactory = await ethers.getContractFactory("LZEndpointMock");
        lzEndpointMock = (await LZEndpointMockFactory.deploy()) as LZEndpointMock;
        await lzEndpointMock.deployed();
        // Set delegate to owner for mock
        await lzEndpointMock.setDelegate(owner.address);

        const WancashFactory = await ethers.getContractFactory("Wancash");
        const network = await ethers.provider.getNetwork();

        // Deploy Wancash
        wancash = (await WancashFactory.deploy(
            "Wancash",
            "WCH",
            lzEndpointMock.address,
            owner.address,
            owner.address, // Treasury Address (Default to owner for test)
            network.chainId,
            INITIAL_SUPPLY
        )) as Wancash;
        await wancash.deployed();
    });

    it("Should deploy with correct Vesting and Supply", async function () {
        // Check Total Supply
        expect((await wancash.totalSupply()).eq(INITIAL_SUPPLY)).to.be.true;

        // Check Vesting (50%)
        const vestingAddress = await wancash.vestingWallet();
        expect(vestingAddress).to.not.equal(ethers.constants.AddressZero);

        const vestingBalance = await wancash.balanceOf(vestingAddress);
        expect(vestingBalance.eq(INITIAL_SUPPLY.div(2))).to.be.true;

        // Check Owner Balance (50%)
        const ownerBalance = await wancash.balanceOf(owner.address);
        expect(ownerBalance.eq(INITIAL_SUPPLY.div(2))).to.be.true;
    });

    it("Should enforce Max Transaction Limit (0.1%)", async function () {
        // 0.1% of 1,000,000 = 1,000
        const maxTx = INITIAL_SUPPLY.mul(1).div(1000);
        const exceedAmount = maxTx.add(ethers.utils.parseEther("1"));
        const validAmount = maxTx;

        // Owner is excluded, send to User1
        await wancash.transfer(user1.address, maxTx.mul(2));

        // User1 tries to send more than limit to User2
        // User1 is NOT excluded
        await expectRevert(
            wancash.connect(user1).transfer(user2.address, exceedAmount),
            "Exceeds max transaction amount"
        );

        // Valid amount should pass
        await wancash.connect(user1).transfer(user2.address, validAmount);
    });

    it("Should enforce Is Excluded From Fee", async function () {
        // 0.1% of 1,000,000 = 1,000
        const maxTx = INITIAL_SUPPLY.mul(1).div(1000);
        const exceedAmount = maxTx.add(ethers.utils.parseEther("1"));

        // Owner IS excluded, should be able to send more than limit
        await wancash.transfer(user1.address, exceedAmount);
    });

    it("Should enforce Taxes on Buys/Sells", async function () {
        // Setup Pair
        await wancash.setAutomatedMarketMakerPair(pair.address, true);
        // Set Treasury to a clean address
        await wancash.setTreasuryAddress(treasury.address);

        // Fund pair (simulated LP)
        await wancash.transfer(pair.address, ethers.utils.parseEther("10000"));

        // BUY: Pair -> User1
        // Tax: 3%
        const buyAmount = ethers.utils.parseEther("100");
        const taxAmount = buyAmount.mul(3).div(100);
        const receiveAmount = buyAmount.sub(taxAmount);

        // Transfer from Pair
        await wancash.connect(pair).transfer(user1.address, buyAmount);

        const treasuryBalance = await wancash.balanceOf(treasury.address);
        const user1Balance = await wancash.balanceOf(user1.address);

        expect(treasuryBalance.eq(taxAmount)).to.be.true;
        expect(user1Balance.eq(receiveAmount)).to.be.true;
    });

    it("Should enforce Anti-Bot Cooldown", async function () {
        // Setup Pair
        await wancash.setAutomatedMarketMakerPair(pair.address, true);

        // Fund pair (simulated LP)
        await wancash.transfer(pair.address, ethers.utils.parseEther("10000"));

        // First Buy
        await wancash.connect(pair).transfer(user1.address, ethers.utils.parseEther("10"));

        // Immediate Second Buy
        await expectRevert(
            wancash.connect(pair).transfer(user1.address, ethers.utils.parseEther("10")),
            "Transfer blocked by cooldown"
        );
    });
});
