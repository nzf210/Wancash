// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockPancakeV3Pool {
    address public token0;
    address public token1;

    int56 private tickCumulativePast;
    int56 private tickCumulativeNow;

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    function setObservations(int56 _past, int56 _now) external {
        tickCumulativePast = _past;
        tickCumulativeNow = _now;
    }

    function observe(
        uint32[] calldata secondsAgos
    ) external view returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s) {
        require(secondsAgos.length == 2, "Mock expects 2 observations");
        tickCumulatives = new int56[](2);
        secondsPerLiquidityCumulativeX128s = new uint160[](2);
        tickCumulatives[0] = tickCumulativePast;
        tickCumulatives[1] = tickCumulativeNow;
        secondsPerLiquidityCumulativeX128s[0] = 0;
        secondsPerLiquidityCumulativeX128s[1] = 0;
    }
}
