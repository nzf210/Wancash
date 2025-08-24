// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    // Constructor akan memberi nama "Mock USDT" dan simbol "mUSDT" ke token kita.
    // Kita juga akan mencetak 1,000,000 token (dengan 18 desimal) ke alamat yang melakukan deploy.
    constructor() ERC20("Mock USDT", "mUSDT") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Fungsi optional: Untuk mencetak lebih banyak token testing nanti jika diperlukan
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}