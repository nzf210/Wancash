// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";
import { VestingWallet } from "@openzeppelin/contracts/finance/VestingWallet.sol";

contract Wancash is OFT {
    uint16 public immutable mainChainId;

    // Anti-Whale & Anti-Bot
    uint256 public maxTxAmount;
    uint256 public maxWalletAmount;
    uint256 public antiBotDuration = 40; // Default 40 seconds
    mapping(address => uint256) public _lastBuyTime;

    // Taxes
    uint256 public buyTax = 3;
    uint256 public sellTax = 5;
    address public treasuryAddress;

    // Vesting
    address public vestingWallet;

    // Mappings
    mapping(address => bool) public _isExcludedFromFee;
    mapping(address => bool) public automatedMarketMakerPairs;

    event VestingWalletDeployed(address indexed wallet, uint256 amount);
    event TreasuryAddressUpdated(address indexed newTreasury);
    event TaxesUpdated(uint256 buyTax, uint256 sellTax);
    event LimitsUpdated(uint256 maxTx, uint256 maxWallet);
    event AntiBotDurationUpdated(uint256 duration);
    event ExcludeFromFee(address indexed account, bool isExcluded);
    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);

    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        address _treasury,
        uint16 _mainChainId,
        uint256 _initialSupply
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) Ownable(_delegate) {
        mainChainId = _mainChainId;

        treasuryAddress = _treasury;

        // Default Exclusions
        _isExcludedFromFee[_delegate] = true;
        _isExcludedFromFee[address(this)] = true;
        _isExcludedFromFee[_lzEndpoint] = true;
        _isExcludedFromFee[_treasury] = true;
        _isExcludedFromFee[address(0)] = true;

        // Set initial limits (Dynamic calculation in logic, but valid values here)
        // Note: Actual enforcement uses percentage of totalSupply() at runtime.

        // Only mint initial supply if deployed on main chain
        if (block.chainid == _mainChainId) {
            uint256 vestingAmount = _initialSupply / 2; // 50%
            uint256 liquidAmount = _initialSupply - vestingAmount;

            // Deploy Vesting Wallet
            // Duration: 60 months * 30 days = 1800 days = 155520000 seconds approx
            // Or precise: 5 years (avg 365.25 days) = 157788000 seconds.
            // User asked for "60 Bulan" (60 Months). 60 * 30 * 24 * 3600 = 155520000
            uint64 duration = 155520000;

            // Create Vesting Wallet owned by _delegate (Owner)
            VestingWallet vesting = new VestingWallet(_delegate, uint64(block.timestamp), duration);
            vestingWallet = address(vesting);
            _isExcludedFromFee[vestingWallet] = true;

            _mint(vestingWallet, vestingAmount);
            emit VestingWalletDeployed(vestingWallet, vestingAmount);

            _mint(_delegate, liquidAmount);
        }
    }

    function mint(address, uint256) public virtual {
        revert("Direct minting disabled - use cross-chain transfer");
    }

    // --- Configuration Functions ---

    function setTreasuryAddress(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid address");
        treasuryAddress = _treasury;
        emit TreasuryAddressUpdated(_treasury);
    }

    function setTaxes(uint256 _buyTax, uint256 _sellTax) external onlyOwner {
        require(_buyTax <= 20 && _sellTax <= 20, "Taxes too high");
        buyTax = _buyTax;
        sellTax = _sellTax;
        emit TaxesUpdated(_buyTax, _sellTax);
    }

    function setAntiBotDuration(uint256 _duration) external onlyOwner {
        require(_duration <= 600, "Duration too long");
        antiBotDuration = _duration;
        emit AntiBotDurationUpdated(_duration);
    }

    function setAutomatedMarketMakerPair(address pair, bool value) external onlyOwner {
        require(pair != address(0), "Invalid pair");
        automatedMarketMakerPairs[pair] = value;
        emit SetAutomatedMarketMakerPair(pair, value);
    }

    function excludeFromFee(address account, bool excluded) external onlyOwner {
        _isExcludedFromFee[account] = excluded;
        emit ExcludeFromFee(account, excluded);
    }

    // --- Override _update for Logic ---

    function _update(address from, address to, uint256 value) internal virtual override {
        // Skip if minting or burning
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        // Calculate dynamic limits based on current TOTAL SUPPLY
        uint256 total = totalSupply();
        uint256 limitTx = (total * 1) / 1000; // 0.1%
        uint256 limitWallet = (total * 5) / 1000; // 0.5%

        bool excluded = _isExcludedFromFee[from] || _isExcludedFromFee[to];

        // Anti-Whale & Anti-Bot Checks
        if (!excluded) {
            // Check Max Transaction Amount
            require(value <= limitTx, "Exceeds max transaction amount");

            // Check Max Wallet Holding (only on buy/transfer to holder)
            if (!automatedMarketMakerPairs[to]) {
                require(balanceOf(to) + value <= limitWallet, "Exceeds max wallet holding");
            }

            // Anti-Bot: Buy Cooldown
            if (automatedMarketMakerPairs[from]) {
                require(block.timestamp > _lastBuyTime[to] + antiBotDuration, "Transfer blocked by cooldown");
                _lastBuyTime[to] = block.timestamp;
            }
        }

        uint256 taxAmount = 0;

        // Apply Taxes only if not excluded
        if (!excluded) {
            // Buy: Pair -> Wallet
            if (automatedMarketMakerPairs[from] && buyTax > 0) {
                taxAmount = (value * buyTax) / 100;
            }
            // Sell: Wallet -> Pair
            else if (automatedMarketMakerPairs[to] && sellTax > 0) {
                taxAmount = (value * sellTax) / 100;
            }
        }

        if (taxAmount > 0) {
            super._update(from, treasuryAddress, taxAmount);
            value -= taxAmount;
        }

        super._update(from, to, value);
    }
}
