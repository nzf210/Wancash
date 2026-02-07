// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IPancakeV3Pool {
    function token0() external view returns (address);

    function token1() external view returns (address);

    function observe(
        uint32[] calldata secondsAgos
    ) external view returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s);
}

library FullMath {
    function mulDiv(uint256 a, uint256 b, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            uint256 prod0;
            uint256 prod1;
            assembly {
                let mm := mulmod(a, b, not(0))
                prod0 := mul(a, b)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            if (prod1 == 0) {
                require(denominator > 0, "division by zero");
                assembly {
                    result := div(prod0, denominator)
                }
                return result;
            }

            require(denominator > prod1, "overflow");

            uint256 remainder;
            assembly {
                remainder := mulmod(a, b, denominator)
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            uint256 twos = denominator & (~denominator + 1);
            assembly {
                denominator := div(denominator, twos)
                prod0 := div(prod0, twos)
                twos := add(div(sub(0, twos), twos), 1)
            }

            prod0 |= prod1 * twos;

            uint256 inv = (3 * denominator) ^ 2;
            inv *= 2 - denominator * inv;
            inv *= 2 - denominator * inv;
            inv *= 2 - denominator * inv;
            inv *= 2 - denominator * inv;
            inv *= 2 - denominator * inv;
            inv *= 2 - denominator * inv;

            result = prod0 * inv;
            return result;
        }
    }
}

library TickMath {
    int24 internal constant MIN_TICK = -887272;
    int24 internal constant MAX_TICK = -MIN_TICK;
    uint160 internal constant MIN_SQRT_RATIO = 4295128739;
    uint160 internal constant MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342;

    function getSqrtRatioAtTick(int24 tick) internal pure returns (uint160 sqrtPriceX96) {
        unchecked {
            int24 absTick = tick < 0 ? -tick : tick;
            require(absTick <= MAX_TICK, "T");

            uint256 ratio = absTick & 0x1 != 0
                ? 0xfffcb933bd6fad37aa2d162d1a594001
                : 0x100000000000000000000000000000000;
            if (absTick & 0x2 != 0) ratio = (ratio * 0xfff97272373d413259a46990580e213a) >> 128;
            if (absTick & 0x4 != 0) ratio = (ratio * 0xfff2e50f5f656932ef12357cf3c7fdcc) >> 128;
            if (absTick & 0x8 != 0) ratio = (ratio * 0xffe5caca7e10e4e61c3624eaa0941cd0) >> 128;
            if (absTick & 0x10 != 0) ratio = (ratio * 0xffcb9843d60f6159c9db58835c926644) >> 128;
            if (absTick & 0x20 != 0) ratio = (ratio * 0xff973b41fa98c081472e6896dfb254c0) >> 128;
            if (absTick & 0x40 != 0) ratio = (ratio * 0xff2ea16466c96a3843ec78b326b52861) >> 128;
            if (absTick & 0x80 != 0) ratio = (ratio * 0xfe5dee046a99a2a811c461f1969c3053) >> 128;
            if (absTick & 0x100 != 0) ratio = (ratio * 0xfcbe86c7900a88aedcffc83b479aa3a4) >> 128;
            if (absTick & 0x200 != 0) ratio = (ratio * 0xf987a7253ac413176f2b074cf7815e54) >> 128;
            if (absTick & 0x400 != 0) ratio = (ratio * 0xf3392b0822b70005940c7a398e4b70f3) >> 128;
            if (absTick & 0x800 != 0) ratio = (ratio * 0xe7159475a2c29b7443b29c7fa6e889d9) >> 128;
            if (absTick & 0x1000 != 0) ratio = (ratio * 0xd097f3bdfd2022b8845ad8f792aa5825) >> 128;
            if (absTick & 0x2000 != 0) ratio = (ratio * 0xa9f746462d870fdf8a65dc1f90e061e5) >> 128;
            if (absTick & 0x4000 != 0) ratio = (ratio * 0x70d869a156d2a1b890bb3df62baf32f7) >> 128;
            if (absTick & 0x8000 != 0) ratio = (ratio * 0x31be135f97d08fd981231505542fcfa6) >> 128;
            if (absTick & 0x10000 != 0) ratio = (ratio * 0x9aa508b5b7a84e1c677de54f3e99bc9) >> 128;
            if (absTick & 0x20000 != 0) ratio = (ratio * 0x5d6af8dedb81196699c329225ee604) >> 128;
            if (absTick & 0x40000 != 0) ratio = (ratio * 0x2216e584f5fa1ea926041bedfe98) >> 128;
            if (absTick & 0x80000 != 0) ratio = (ratio * 0x48a170391f7dc42444e8fa2) >> 128;

            if (tick > 0) ratio = type(uint256).max / ratio;

            sqrtPriceX96 = uint160((ratio >> 32) + (ratio % (1 << 32) == 0 ? 0 : 1));
        }
    }
}

interface IWancashBurnable {
    function burnFromVesting(uint256 amount) external;
}

contract WancashVesting is Ownable {
    IERC20 public token;
    IERC20 public usdt;
    IPancakeV3Pool public pool;
    address public treasury;

    bool public initialized;
    bool public tokenIsToken0;
    uint8 public tokenDecimals;
    uint8 public usdtDecimals;

    uint256 public totalAllocation;
    uint256 public monthlyAmount;
    uint256 public monthsReleased;
    uint256 public startTimestamp;

    uint256 public previousMonthAvgPrice; // USDT per 1 WCH, 1e18 scaled
    uint256 public constant TWAP_WINDOW = 30 days;

    uint256 public constant MONTH = 30 days;
    uint256 public constant TOTAL_MONTHS = 60;

    event Initialized(address token, address usdt, address pool, address treasury, uint256 totalAllocation);
    event Released(uint256 monthIndex, uint256 amountToTreasury, uint256 burned, uint256 avgPrice);
    event TreasuryUpdated(address indexed treasury);

    constructor() Ownable(msg.sender) {}

    function initialize(
        address _token,
        address _usdt,
        address _pair,
        address _treasury,
        uint256 _totalAllocation
    ) external onlyOwner {
        require(!initialized, "Already initialized");
        require(_token != address(0) && _usdt != address(0) && _pair != address(0), "Invalid address");
        require(_treasury != address(0), "Invalid treasury");
        require(_totalAllocation > 0, "Invalid allocation");

        token = IERC20(_token);
        usdt = IERC20(_usdt);
        pool = IPancakeV3Pool(_pair);
        treasury = _treasury;
        totalAllocation = _totalAllocation;
        monthlyAmount = _totalAllocation / TOTAL_MONTHS;

        address t0 = pool.token0();
        address t1 = pool.token1();
        require((t0 == _token && t1 == _usdt) || (t0 == _usdt && t1 == _token), "Pool mismatch");
        tokenIsToken0 = (t0 == _token);

        tokenDecimals = IERC20Metadata(_token).decimals();
        usdtDecimals = IERC20Metadata(_usdt).decimals();

        startTimestamp = block.timestamp;

        initialized = true;
        emit Initialized(_token, _usdt, _pair, _treasury, _totalAllocation);
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    function nextReleaseTime() public view returns (uint256) {
        return startTimestamp + (monthsReleased + 1) * MONTH;
    }

    function release() external {
        require(initialized, "Not initialized");
        require(monthsReleased < TOTAL_MONTHS, "All months released");
        require(block.timestamp >= nextReleaseTime(), "Too early");

        uint32[] memory secondsAgos = new uint32[](2);
        secondsAgos[0] = uint32(TWAP_WINDOW);
        secondsAgos[1] = 0;
        (int56[] memory tickCumulatives, ) = pool.observe(secondsAgos);
        int56 tickDelta = tickCumulatives[1] - tickCumulatives[0];
        int24 avgTick = int24(tickDelta / int56(uint56(TWAP_WINDOW)));
        if (tickDelta < 0 && (tickDelta % int56(uint56(TWAP_WINDOW)) != 0)) {
            avgTick--;
        }
        uint256 avgPrice = _quoteFromTick(avgTick);

        uint256 remaining = totalAllocation - (monthlyAmount * monthsReleased);
        uint256 amountForThisMonth = monthsReleased + 1 == TOTAL_MONTHS ? remaining : monthlyAmount;

        uint256 burnAmount = 0;
        if (previousMonthAvgPrice != 0 && avgPrice < (previousMonthAvgPrice * 80) / 100) {
            burnAmount = amountForThisMonth / 2;
        }
        uint256 releaseAmount = amountForThisMonth - burnAmount;

        previousMonthAvgPrice = avgPrice;
        monthsReleased += 1;

        if (burnAmount > 0) {
            IWancashBurnable(address(token)).burnFromVesting(burnAmount);
        }
        require(token.balanceOf(address(this)) >= releaseAmount, "Insufficient balance");
        require(token.transfer(treasury, releaseAmount), "Transfer failed");

        emit Released(monthsReleased, releaseAmount, burnAmount, avgPrice);
    }

    function _quoteFromTick(int24 tick) internal view returns (uint256) {
        uint160 sqrtPriceX96 = TickMath.getSqrtRatioAtTick(tick);
        uint256 baseAmount = 10 ** uint256(tokenDecimals);
        uint256 quoteAmount;

        if (sqrtPriceX96 <= type(uint128).max) {
            uint256 ratioX192 = uint256(sqrtPriceX96) * sqrtPriceX96;
            quoteAmount = tokenIsToken0
                ? FullMath.mulDiv(ratioX192, baseAmount, 1 << 192)
                : FullMath.mulDiv(1 << 192, baseAmount, ratioX192);
        } else {
            uint256 ratioX128 = FullMath.mulDiv(sqrtPriceX96, sqrtPriceX96, 1 << 64);
            quoteAmount = tokenIsToken0
                ? FullMath.mulDiv(ratioX128, baseAmount, 1 << 128)
                : FullMath.mulDiv(1 << 128, baseAmount, ratioX128);
        }

        return (quoteAmount * 1e18) / (10 ** uint256(usdtDecimals));
    }
}
