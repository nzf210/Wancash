// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract Wancash is OFT {
    uint16 public immutable mainChainId;

    // Anti-Whale & Anti-Bot
    uint256 public maxWalletAmount;
    uint256 public antiBotDuration = 40; // Default 40 seconds
    mapping(address => uint256) public _lastBuyTime;

    // Taxes
    uint256 public buyTax = 3;
    uint256 public sellTax = 5;
    address public treasuryAddress;

    // Vesting
    address public vestingContract;

    // Mappings
    mapping(address => bool) public _isExcludedFromFee;
    mapping(address => bool) public _isExcludedFromLimits;
    mapping(address => bool) public automatedMarketMakerPairs;

    event VestingContractUpdated(address indexed wallet);
    event TreasuryAddressUpdated(address indexed newTreasury);
    event TaxesUpdated(uint256 buyTax, uint256 sellTax);
    event AntiBotDurationUpdated(uint256 duration);
    event ExcludeFromFee(address indexed account, bool isExcluded);
    event ExcludeFromLimits(address indexed account, bool isExcluded);
    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);
    event LimitsEnabledUpdated(bool enabled);
    event MaxWalletAmountUpdated(uint256 maxWallet);

    bool public limitsEnabled = true;

    struct WancashConfig {
        string name;
        string symbol;
        address lzEndpoint;
        address delegate;
        address treasury;
        uint16 mainChainId;
        uint256 initialSupply;
        uint256 ownerAllocation;
        address vestingContract;
    }

    constructor(
        WancashConfig memory _config
    ) OFT(_config.name, _config.symbol, _config.lzEndpoint, _config.delegate) Ownable(_config.delegate) {
        mainChainId = _config.mainChainId;

        treasuryAddress = _config.treasury;
        vestingContract = _config.vestingContract;

        // Default Exclusions
        _isExcludedFromFee[_config.delegate] = true;
        _isExcludedFromFee[address(this)] = true;
        _isExcludedFromFee[_config.lzEndpoint] = true;
        _isExcludedFromFee[_config.treasury] = true;
        _isExcludedFromFee[address(0)] = true;
        if (_config.vestingContract != address(0)) {
            _isExcludedFromFee[_config.vestingContract] = true;
        }

        _isExcludedFromLimits[_config.delegate] = true;
        _isExcludedFromLimits[address(this)] = true;
        _isExcludedFromLimits[_config.lzEndpoint] = true;
        _isExcludedFromLimits[_config.treasury] = true;
        _isExcludedFromLimits[address(0)] = true;
        if (_config.vestingContract != address(0)) {
            _isExcludedFromLimits[_config.vestingContract] = true;
        }

        // Fixed max wallet cap across all chains (5,000,000 tokens)
        maxWalletAmount = 5_000_000 * (10 ** uint256(decimals()));

        // Only mint initial supply if deployed on main chain
        if (block.chainid == _config.mainChainId) {
            require(_config.ownerAllocation <= _config.initialSupply, "Owner allocation exceeds supply");
            uint256 vestingAmount = _config.initialSupply - _config.ownerAllocation;

            if (vestingAmount > 0) {
                require(_config.vestingContract != address(0), "Vesting contract required");
                _mint(_config.vestingContract, vestingAmount);
            }
            if (_config.ownerAllocation > 0) {
                _mint(_config.delegate, _config.ownerAllocation);
            }
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

    function setLimitsEnabled(bool _enabled) external onlyOwner {
        limitsEnabled = _enabled;
        emit LimitsEnabledUpdated(_enabled);
    }

    function setMaxWalletAmount(uint256 _maxWallet) external onlyOwner {
        require(_maxWallet > 0, "Invalid max wallet");
        maxWalletAmount = _maxWallet;
        emit MaxWalletAmountUpdated(_maxWallet);
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

    function setVestingContract(address _vesting) external onlyOwner {
        require(_vesting != address(0), "Invalid address");
        vestingContract = _vesting;
        _isExcludedFromFee[_vesting] = true;
        _isExcludedFromLimits[_vesting] = true;
        emit VestingContractUpdated(_vesting);
    }

    function burnFromVesting(uint256 amount) external {
        require(msg.sender == vestingContract, "Not vesting contract");
        _burn(msg.sender, amount);
    }

    function excludeFromLimits(address account, bool excluded) external onlyOwner {
        _isExcludedFromLimits[account] = excluded;
        emit ExcludeFromLimits(account, excluded);
    }

    function setBatchExcludedFromLimits(address[] calldata accounts, bool excluded) external onlyOwner {
        uint256 length = accounts.length;
        for (uint256 i = 0; i < length; i++) {
            address account = accounts[i];
            _isExcludedFromLimits[account] = excluded;
            emit ExcludeFromLimits(account, excluded);
        }
    }

    function getMaxTxAmount() public view returns (uint256) {
        return (totalSupply() * 1) / 1000; // 0.1% per chain
    }

    // --- Override _update for Logic ---

    function _update(address from, address to, uint256 value) internal virtual override {
        // Skip if minting or burning
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }

        bool excludedFromFee = _isExcludedFromFee[from] || _isExcludedFromFee[to];
        bool excludedFromLimits = _isExcludedFromLimits[to];

        // Anti-Whale & Anti-Bot Checks (BUY only from AMM)
        if (limitsEnabled && automatedMarketMakerPairs[from] && !excludedFromLimits) {
            // Check Max Transaction Amount (0.1% per chain)
            uint256 limitTx = getMaxTxAmount();
            require(value <= limitTx, "Exceeds max transaction amount");

            // Check Max Wallet Holding (fixed 5,000,000 tokens)
            if (!automatedMarketMakerPairs[to]) {
                require(balanceOf(to) + value <= maxWalletAmount, "Exceeds max wallet holding");
            }

            // Anti-Bot: Buy Cooldown
            if (antiBotDuration > 0) {
                require(block.timestamp > _lastBuyTime[to] + antiBotDuration, "Transfer blocked by cooldown");
                _lastBuyTime[to] = block.timestamp;
            }
        }

        uint256 taxAmount = 0;

        // Apply Taxes only if not excluded
        if (!excludedFromFee) {
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
