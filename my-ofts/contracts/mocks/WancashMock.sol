// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Wancash } from "../Wancash.sol";

contract WancashMock is Wancash {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        address _treasury,
        uint16 _mainChainId,
        uint256 _initialSupply
    ) Wancash(_name, _symbol, _lzEndpoint, _delegate, _treasury, _mainChainId, _initialSupply) {}

    function mint(address _to, uint256 _amount) public virtual override {
        _mint(_to, _amount);
    }
}
