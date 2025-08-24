// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * WancashStaking
 *
 * Fitur utama:
 * - 5 lock period (7/30/90/180/360 hari) dengan APR (3/8/13/20/45%)
 * - Minimal stake 10 USDT
 * - Reward harian, claim kapan saja
 * - Reward hybrid: 50% USDT + 50% WANCASH
 * - 5% dari reward untuk upline (hanya yang eligible: pernah stake >=100 USDT dan lock 180 hari)
 * - Referrer wajib; jika tak valid -> fallback ke owner()
 * - Withdraw pokok setelah lock habis
 * - Emergency withdraw hanya owner
 * - Opsi auto-split setoran staking: 60% ke wancashBuyer, 30% ke poolWallet, 10% cadangan reward
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IERC20Metadata is IERC20 {
    function decimals() external view returns (uint8);
}

contract EnhancedStakingUsdt is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct StakeInfo {
        address user;
        uint256 amount;        // USDT staked (pokok)
        uint256 startTime;
        uint256 duration;      // seconds
        uint256 aprBps;        // basis points, e.g. 300 = 3%
        uint256 lastClaim;     // timestamp terakhir klaim
        address referrer;      // upline untuk komisi 5%
        bool withdrawn;        // pokok sudah ditarik
    }

    IERC20 public immutable USDT;
    IERC20 public immutable WANCASH;

    // Konfigurasi alamat untuk auto-split dana masuk (opsional)
    address public poolWallet;      // menerima 30% (likuiditas/operasional)
    address public wancashBuyer;    // menerima 60% untuk membeli WANCASH off-chain/on-chain
    bool    public autoSplit;       // jika true, 60% & 30% langsung ditransfer

    // Lock periods (detik) dan APR (bps) harus sejajar indeksnya
    // uint256[] public lockOptions = [
    //     7 days,
    //     30 days,
    //     90 days,
    //     180 days,
    //     360 days
    // ];
    uint256[] public lockOptions = [
        3 minutes,
        6 minutes,
        10 minutes,
        15 minutes,
        30 minutes
    ];

    uint256[] public aprBpsOptions = [
        300,   // 3%
        800,   // 8%
        1300,  // 13%
        2000,  // 20%
        4500   // 45%
    ];

    // Minimum stake & syarat eligible upline
    uint256 public minStake;                  // 10 USDT (diset dari decimals USDT)
    uint256 public uplineEligibleMinAmount;   // 100 USDT (diset dari decimals USDT)
    uint256 public constant UPLINE_FEE_BPS = 500; // 5% dari reward total
    uint256 public constant BPS_DENOM = 10000;

    // Penyebut waktu (perhitungan reward harian berbasis detik)
    uint256 private constant YEAR_IN_SECONDS = 365 days;

    // Data stake
    uint256 public nextStakeId = 1;
    mapping(uint256 => StakeInfo) public stakes;        // stakeId => info
    mapping(address => uint256[]) public userStakes;    // user => daftar stakeId
    mapping(address => bool) public eligibleUpline;     // siapa yang berhak menjadi upline

    // Events
    event Staked(
        uint256 indexed stakeId,
        address indexed user,
        uint256 amount,
        uint256 duration,
        uint256 aprBps,
        address indexed referrer
    );
    event Claimed(
        uint256 indexed stakeId,
        address indexed user,
        uint256 usdtToUser,
        uint256 wancToUser,
        address indexed referrer,
        uint256 usdtToRef,
        uint256 wancToRef
    );
    event WithdrawnPrincipal(uint256 indexed stakeId, address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed token, address indexed to, uint256 amount);
    event AutoSplitExecuted(
        uint256 indexed stakeId,
        uint256 toBuyer,   // 60%
        uint256 toPool,    // 30%
        uint256 toReserve  // 10% (retained in contract)
    );
    event UplineEligibilityGained(address indexed user);
    event SetWallets(address poolWallet, address wancashBuyer);
    event SetAutoSplit(bool enabled);

    constructor(address _usdt, address _wancash, address _owner) Ownable(_owner) {
        require(_usdt != address(0) && _wancash != address(0), "Invalid token");
        USDT = IERC20(_usdt);
        WANCASH = IERC20(_wancash);

        // Tetapkan nilai berbasis decimals USDT
        uint8 usdtDec = IERC20Metadata(_usdt).decimals();
        minStake = 10 * (10 ** usdtDec);              // 10 USDT
        uplineEligibleMinAmount = 100 * (10 ** usdtDec); // 100 USDT

        // Owner default eligible sebagai upline
        eligibleUpline[_owner] = true;
    }

    // ============ Admin Config ============
    function setWallets(address _poolWallet, address _wancashBuyer) external onlyOwner {
        poolWallet = _poolWallet;
        wancashBuyer = _wancashBuyer;
        emit SetWallets(_poolWallet, _wancashBuyer);
    }

    function setAutoSplit(bool _enabled) external onlyOwner {
        autoSplit = _enabled;
        emit SetAutoSplit(_enabled);
    }

    // ============ View Helpers ============
    function getAprBpsForDuration(uint256 duration) public view returns (uint256 aprBps) {
        for (uint256 i = 0; i < lockOptions.length; i++) {
            if (lockOptions[i] == duration) {
                return aprBpsOptions[i];
            }
        }
        revert("Invalid duration");
    }

    function getUserStakes(address user) external view returns (uint256[] memory) {
        return userStakes[user];
    }

    function endTimeOf(uint256 stakeId) public view returns (uint256) {
        StakeInfo memory s = stakes[stakeId];
        require(s.user != address(0), "Stake not found");
        return s.startTime + s.duration;
    }

    /**
     * Menghitung reward yang belum diklaim & sisa waktu lock.
     * Mengembalikan (usdtReward, wancReward, sisaLockDetik)
     */
    function pendingRewards(uint256 stakeId)
        public
        view
        returns (uint256 usdtReward, uint256 wancReward, uint256 sisaLock)
    {
        StakeInfo memory s = stakes[stakeId];
        require(s.user != address(0), "Stake not found");

        uint256 cappedNow = block.timestamp;
        uint256 endT = s.startTime + s.duration;
        if (cappedNow > endT) cappedNow = endT;

        if (cappedNow > s.lastClaim && s.amount > 0) {
            uint256 elapsed = cappedNow - s.lastClaim;
            uint256 totalReward = (s.amount * s.aprBps * elapsed) / (BPS_DENOM * YEAR_IN_SECONDS);
            // Split 50/50
            usdtReward = totalReward / 2;
            wancReward = totalReward - usdtReward;
        }

        if (block.timestamp >= endT) {
            sisaLock = 0;
        } else {
            sisaLock = endT - block.timestamp;
        }
    }

    // ============ Core Logic ============
    /**
     * Stake USDT.
     * @param amount jumlah USDT
     * @param duration salah satu dari {7d, 30d, 90d, 180d, 360d}
     * @param referrer alamat upline; jika tidak eligible -> fallback owner()
     */
    function stake(uint256 amount, uint256 duration, address referrer)
        external
        nonReentrant
    {
        require(amount >= minStake, "Amount below minimum");
        uint256 aprBps = getAprBpsForDuration(duration);

        // Validasi referrer
        address finalRef = referrer;
        if (
            finalRef == address(0) ||
            finalRef == msg.sender ||
            !eligibleUpline[finalRef]
        ) {
            finalRef = owner();
        }

        // Transfer USDT dari user ke kontrak
        USDT.safeTransferFrom(msg.sender, address(this), amount);

        // Buat entri stake
        uint256 stakeId = nextStakeId++;
        stakes[stakeId] = StakeInfo({
            user: msg.sender,
            amount: amount,
            startTime: block.timestamp,
            duration: duration,
            aprBps: aprBps,
            lastClaim: block.timestamp,
            referrer: finalRef,
            withdrawn: false
        });
        userStakes[msg.sender].push(stakeId);

        // Cek apakah user mendapatkan status eligible upline (khusus jika lock 180 hari dan amount >= 100 USDT)
        if (duration == 180 days && amount >= uplineEligibleMinAmount && !eligibleUpline[msg.sender]) {
            eligibleUpline[msg.sender] = true;
            emit UplineEligibilityGained(msg.sender);
        }

        // Jalankan auto-split (opsional)
        if (autoSplit) {
            require(poolWallet != address(0) && wancashBuyer != address(0), "Split wallets not set");
            uint256 sixty = (amount * 60) / 100; // 60%
            uint256 thirty = (amount * 30) / 100; // 30%
            uint256 ten = amount - sixty - thirty; // 10% remains in contract

            // Kirim 60% ke wancashBuyer (untuk beli WANCASH)
            USDT.safeTransfer(wancashBuyer, sixty);
            // Kirim 30% ke poolWallet (likuiditas/operasional)
            USDT.safeTransfer(poolWallet, thirty);
            // 10% tetap di kontrak (cadangan reward)
            // (tidak ada transfer)

            emit AutoSplitExecuted(stakeId, sixty, thirty, ten);
        }
        // Jika autoSplit == false, seluruh dana tetap berada di kontrak.

        emit Staked(stakeId, msg.sender, amount, duration, aprBps, finalRef);
    }

    /**
     * Klaim reward yang sudah terakumulasi sampai sekarang (atau sampai endTime jika sudah lewat).
     * Membayar 95% ke user dan 5% ke upline, masing-masing dibagi 50% USDT + 50% WANCASH.
     */
    function claim(uint256 stakeId) public nonReentrant {
        StakeInfo storage s = stakes[stakeId];
        require(s.user != address(0), "Stake not found");
        require(s.user == msg.sender, "Not stake owner");
        require(!s.withdrawn, "Principal already withdrawn");

        (uint256 usdtReward, uint256 wancReward, ) = pendingRewards(stakeId);
        require(usdtReward > 0 || wancReward > 0, "No rewards");

        // Update waktu klaim
        uint256 cappedNow = block.timestamp;
        uint256 endT = s.startTime + s.duration;
        if (cappedNow > endT) cappedNow = endT;
        s.lastClaim = cappedNow;

        // 5% ke upline (dari total reward)
        // Konversi kembali total
        uint256 totalReward = usdtReward + wancReward;
        uint256 commission = (totalReward * UPLINE_FEE_BPS) / BPS_DENOM;
        uint256 toUser = totalReward - commission;

        // Bagi lagi 50/50 antara USDT & WANCASH, menjaga totalnya
        uint256 userUsdt = toUser / 2;
        uint256 userWanc = toUser - userUsdt;

        uint256 refUsdt = commission / 2;
        uint256 refWanc = commission - refUsdt;

        // Transfer reward; kontrak harus punya saldo cukup
        if (userUsdt > 0) USDT.safeTransfer(s.user, userUsdt);
        if (userWanc > 0) WANCASH.safeTransfer(s.user, userWanc);

        if (refUsdt > 0) USDT.safeTransfer(s.referrer, refUsdt);
        if (refWanc > 0) WANCASH.safeTransfer(s.referrer, refWanc);

        emit Claimed(stakeId, s.user, userUsdt, userWanc, s.referrer, refUsdt, refWanc);
    }

    /**
     * Withdraw pokok setelah lock habis. Auto-claim reward tersisa sampai endTime.
     */
    function withdrawPrincipal(uint256 stakeId) external nonReentrant {
        StakeInfo storage s = stakes[stakeId];
        require(s.user != address(0), "Stake not found");
        require(s.user == msg.sender, "Not stake owner");
        require(!s.withdrawn, "Already withdrawn");
        uint256 endT = s.startTime + s.duration;
        require(block.timestamp >= endT, "Lock not finished");

        // Klaim sisa reward hingga endTime (jika ada)
        (uint256 usdtReward, uint256 wancReward, ) = pendingRewards(stakeId);
        if (usdtReward > 0 || wancReward > 0) {
            claim(stakeId);
        } else {
            // Pastikan lastClaim tidak lewat endTime
            if (s.lastClaim < endT) s.lastClaim = endT;
        }

        // Tarik pokok
        uint256 amount = s.amount;
        s.amount = 0;
        s.withdrawn = true;

        USDT.safeTransfer(s.user, amount);
        emit WithdrawnPrincipal(stakeId, s.user, amount);
    }

    // ============ Admin Safety ============
    /**
     * Emergency withdrawal oleh owner (mis. migrasi, force settle, atau alasan keamanan).
     * Gunakan dengan bijak. Tidak mengubah data stake.
     */
    function emergencyWithdrawToken(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
        emit EmergencyWithdraw(token, to, amount);
    }

    // ============ Utility ============
    function lockOptionsAll() external view returns (uint256[] memory, uint256[] memory) {
        return (lockOptions, aprBpsOptions);
    }
}
