// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockUniswapV2Pair {
    address public token0;
    address public token1;

    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    function setReserves(uint112 _reserve0, uint112 _reserve1, uint32 _timestamp) external {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
        blockTimestampLast = _timestamp;
    }

    function setCumulative(uint256 _price0Cumulative, uint256 _price1Cumulative) external {
        price0CumulativeLast = _price0Cumulative;
        price1CumulativeLast = _price1Cumulative;
    }

    function getReserves() external view returns (uint112, uint112, uint32) {
        return (reserve0, reserve1, blockTimestampLast);
    }
}
