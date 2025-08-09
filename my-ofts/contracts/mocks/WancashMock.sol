// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Wancash } from "../Wancash.sol";

// @dev WARNING: This is for testing purposes only
contract WancashMock is Wancash {
    uint16 public immutable mainChainId;

    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        uint16 _mainChainId,
        uint256 _initialSupply

    ) Wancash(_name, _symbol, _lzEndpoint, _delegate) {
        mainChainId = _mainChainId;
        
        // Only mint initial supply if deployed on main chain
        if (block.chainid == _mainChainId) {
            _mint(msg.sender, _initialSupply);
        }
    }

    function mint(address, uint256) public virtual {
        revert("Direct minting disabled - use cross-chain transfer");
    }

}
