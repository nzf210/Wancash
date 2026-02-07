// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Wancash } from "../Wancash.sol";

contract WancashMock is Wancash {
    constructor(
        WancashConfig memory _config
    )
        Wancash(_config)
    {}

    function mint(address _to, uint256 _amount) public virtual override {
        _mint(_to, _amount);
    }
}
