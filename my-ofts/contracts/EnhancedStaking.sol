// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract EnhancedStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    uint8 public tokenDecimals = 18;
    IERC20 public stakingToken;
    bool public isTokenChangeable;

    // Lock period options
    enum LockPeriod {
        THREE_MONTHS, // 0
        SIX_MONTHS, // 1
        ONE_YEAR, // 2
        TWO_YEARS, // 3
        THREE_YEARS // 4
    }

    struct LockOption {
        uint256 duration; // Duration in seconds
        uint256 rewardRate; // Reward rate in percentage (80 = 80%)
    }

    struct Stake {
        uint256 amount;
        uint256 startTime;
        LockPeriod lockPeriod;
        bool isLocked;
    }

    mapping(address => Stake) public stakes;
    mapping(uint8 => LockOption) public lockOptions;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount, LockPeriod lockPeriod);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event EmergencyUnstaked(address indexed user, uint256 amount);
    event LockOptionUpdated(uint8 lockPeriod, uint256 duration, uint256 rewardRate);
    event TokenChanged(address indexed oldToken, address indexed newToken);

    constructor(address _stakingToken, bool _isTokenChangeable) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        isTokenChangeable = _isTokenChangeable;

        // Initialize default lock options (production)
        lockOptions[0] = LockOption(90 days, 15); // 3 months = 15%
        lockOptions[1] = LockOption(180 days, 35); // 6 months = 35%
        lockOptions[2] = LockOption(365 days, 80); // 1 year = 80%
        lockOptions[3] = LockOption(730 days, 200); // 2 years = 200%
        lockOptions[4] = LockOption(1095 days, 500); // 3 years = 500%
    }

    // Owner can update lock options
    function setLockOption(uint8 _lockPeriod, uint256 _duration, uint256 _rewardRate) external onlyOwner {
        require(_lockPeriod <= 4, "Invalid lock period");
        require(_duration > 0, "Duration must be > 0");
        require(_rewardRate > 0, "Reward rate must be > 0");

        lockOptions[_lockPeriod] = LockOption(_duration, _rewardRate);
        emit LockOptionUpdated(_lockPeriod, _duration, _rewardRate);
    }

    // Owner can change the staking token (if allowed)
    function changeStakingToken(address _newToken) external onlyOwner {
        require(isTokenChangeable, "Token change is disabled");
        require(_newToken != address(0), "Invalid token address");
        require(totalStaked == 0, "Cannot change token when there are active stakes");

        emit TokenChanged(address(stakingToken), _newToken);
        stakingToken = IERC20(_newToken);
    }

    function disableTokenChange() external onlyOwner {
        isTokenChangeable = false;
    }

    function enaableTokenChange() external onlyOwner {
        isTokenChangeable = true;
    }

    function stake(uint256 _amount, LockPeriod _lockPeriod) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(uint8(_lockPeriod) <= 4, "Invalid lock period");
        require(stakes[msg.sender].amount == 0, "Already have active stake");

        uint8 decimals = getTokenDecimals();
        uint256 normalizedAmount = _amount * (10 ** decimals);

        uint256 balanceBefore = stakingToken.balanceOf(address(this));
        stakingToken.safeTransferFrom(msg.sender, address(this), normalizedAmount);
        uint256 actualReceived = stakingToken.balanceOf(address(this)) - balanceBefore;

        stakes[msg.sender] = Stake({
            amount: actualReceived,
            startTime: block.timestamp,
            lockPeriod: _lockPeriod,
            isLocked: true
        });

        totalStaked += actualReceived;
        emit Staked(msg.sender, actualReceived, _lockPeriod);
    }

    function setTokenDecimals(uint8 _decimals) external onlyOwner {
        tokenDecimals = _decimals;
    }

    function getTokenDecimals() public view returns (uint8) {
        try IERC20Metadata(address(stakingToken)).decimals() returns (uint8 decimalPlaces) {
            return decimalPlaces;
        } catch {
            return 18; // Default ke 18 jika tidak ada fungsi decimals
        }
    }

    function unstake() external nonReentrant {
        Stake memory userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake");
        require(userStake.isLocked, "Stake not active");

        LockOption memory lockOpt = lockOptions[uint8(userStake.lockPeriod)];

        // Check if lock period has been completed
        require(block.timestamp >= userStake.startTime + lockOpt.duration, "Lock period not completed");

        uint256 reward = calculateReward(msg.sender);
        uint256 totalAmount = userStake.amount + reward;

        totalStaked -= userStake.amount;
        delete stakes[msg.sender];

        // Transfer principal + reward
        stakingToken.safeTransfer(msg.sender, totalAmount);
        emit Unstaked(msg.sender, userStake.amount, reward);
    }

    // Emergency unstake - only returns principal, no rewards
    function emergencyUnstake() external nonReentrant {
        Stake memory userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake");
        require(userStake.isLocked, "Stake not active");

        uint256 contractBalance = stakingToken.balanceOf(address(this));
        uint256 amountToWithdraw = userStake.amount > contractBalance ? contractBalance : userStake.amount;

        // Update state before transfer (Checks-Effects-Interactions pattern)
        totalStaked -= userStake.amount;
        delete stakes[msg.sender];

        // Transfer available amount (may be less than staked amount)
        if (amountToWithdraw > 0) {
            stakingToken.safeTransfer(msg.sender, amountToWithdraw);
        }

        emit EmergencyUnstaked(msg.sender, amountToWithdraw);
    }

    function calculateReward(address _user) public view returns (uint256) {
        Stake memory userStake = stakes[_user];
        if (userStake.amount == 0 || !userStake.isLocked) return 0;

        LockOption memory lockOpt = lockOptions[uint8(userStake.lockPeriod)];
        if (block.timestamp < userStake.startTime + lockOpt.duration) return 0;

        return (userStake.amount * lockOpt.rewardRate) / 100;
    }

    // View functions
    function getStakeInfo(
        address _user
    )
        external
        view
        returns (
            uint256 amount,
            uint256 startTime,
            LockPeriod lockPeriod,
            bool isLocked,
            uint256 lockEndTime,
            uint256 potentialReward
        )
    {
        Stake memory userStake = stakes[_user];
        LockOption memory lockOpt = lockOptions[uint8(userStake.lockPeriod)];

        return (
            userStake.amount,
            userStake.startTime,
            userStake.lockPeriod,
            userStake.isLocked,
            userStake.startTime + lockOpt.duration,
            calculateReward(_user)
        );
    }

    function getLockOption(LockPeriod _lockPeriod) external view returns (uint256 duration, uint256 rewardRate) {
        LockOption memory lockOpt = lockOptions[uint8(_lockPeriod)];
        return (lockOpt.duration, lockOpt.rewardRate);
    }

    function getRemainingLockTime(address _user) external view returns (uint256) {
        Stake memory userStake = stakes[_user];
        if (userStake.amount == 0 || !userStake.isLocked) return 0;

        LockOption memory lockOpt = lockOptions[uint8(userStake.lockPeriod)];
        uint256 lockEndTime = userStake.startTime + lockOpt.duration;

        if (block.timestamp >= lockEndTime) return 0;
        return lockEndTime - block.timestamp;
    }

    function canUnstake(address _user) external view returns (bool) {
        Stake memory userStake = stakes[_user];
        if (userStake.amount == 0 || !userStake.isLocked) return false;

        LockOption memory lockOpt = lockOptions[uint8(userStake.lockPeriod)];
        return block.timestamp >= userStake.startTime + lockOpt.duration;
    }
}
