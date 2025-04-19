
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MyLoop {
    uint256 public number;

    constructor(uint256 num) {
        number = num;
    }

    function getNumber() public view returns (uint256[] memory) {
        uint256[] memory result = new uint[](number);
        for (uint256 i = 0; i < number; i++) {
            result[i] = i + 1;
        }
        return result;
    }

    function add (uint a, uint b) public   pure returns (uint) {
        return a + b;
    }
}
