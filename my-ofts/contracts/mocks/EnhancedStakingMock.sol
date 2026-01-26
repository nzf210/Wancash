// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnhancedStakingMock is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public stakingToken;
    bool public isTokenChangeable;
    
    // Lock period options
    enum LockPeriod { 
        THREE_MINUTES,  // 0
        SIX_MINUTES,    // 1
        ONE_HOUR,      // 2
        TWO_HOUR,     // 3
        THREE_HOUR    // 4
    }
    
    struct LockOption {
        uint256 duration;      // Duration in seconds
        uint256 rewardRate;    // Reward rate in percentage (80 = 80%)
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
        
        // Initialize default lock options
        lockOptions[0] = LockOption(3 minutes, 1);     // 3 minutes = 15%
        lockOptions[1] = LockOption(5 minutes, 3);    // 5 minutes = 3%
        lockOptions[2] = LockOption(60 minutes, 8);    // 1 Hour = 8%
        lockOptions[3] = LockOption(120 minutes, 20);   // 2 Hour = 20%
        lockOptions[4] = LockOption(180 minutes, 50);  // 3 Hour = 50%
    }
    
    // Owner can update lock options
    function setLockOption(
        uint8 _lockPeriod, 
        uint256 _duration, 
        uint256 _rewardRate
    ) external onlyOwner {
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
        
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        stakes[msg.sender] = Stake({
            amount: _amount,
            startTime: block.timestamp,
            lockPeriod: _lockPeriod,
            isLocked: true
        });
        
        totalStaked += _amount;
        emit Staked(msg.sender, _amount, _lockPeriod);
    }
    
    function unstake() external nonReentrant {
        Stake memory userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake");
        require(userStake.isLocked, "Stake not active");
        
        LockOption memory lockOpt = lockOptions[uint8(userStake.lockPeriod)];
        
        // Check if lock period has been completed
        require(
            block.timestamp >= userStake.startTime + lockOpt.duration,
            "Lock period not completed"
        );
        
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
        
        uint256 amount = userStake.amount;
        totalStaked -= amount;
        delete stakes[msg.sender];
        
        // Only return principal amount
        stakingToken.safeTransfer(msg.sender, amount);
        emit EmergencyUnstaked(msg.sender, amount);
    }
    
    function calculateReward(address _user) public view returns (uint256) {
        Stake memory userStake = stakes[_user];
        if (userStake.amount == 0 || !userStake.isLocked) return 0;
        
        LockOption memory lockOpt = lockOptions[uint8(userStake.lockPeriod)];
        
        // Check if lock period is completed
        if (block.timestamp < userStake.startTime + lockOpt.duration) {
            return 0; // No reward if lock period not completed
        }
        
        // Calculate reward based on the lock option
        return (userStake.amount * lockOpt.rewardRate) / 100;
    }
    
    // View functions
    function getStakeInfo(address _user) external view returns (
        uint256 amount,
        uint256 startTime,
        LockPeriod lockPeriod,
        bool isLocked,
        uint256 lockEndTime,
        uint256 potentialReward
    ) {
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
    
    function getLockOption(LockPeriod _lockPeriod) external view returns (
        uint256 duration,
        uint256 rewardRate
    ) {
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