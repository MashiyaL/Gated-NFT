// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155, Ownable {
    uint256 public nextTokenId;
    string public baseURI;

    string public name;
    string public symbol;

    mapping(uint256 => uint256) public totalSupply;

    constructor(string memory _baseURI) ERC1155(_baseURI) {
        baseURI = _baseURI;
        name = "ABC";
        symbol = "ABC";
    }


    function mint(address to) public onlyOwner {
        _mint(to, nextTokenId, 1, "");
        totalSupply[nextTokenId]++;
        nextTokenId++;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amount) public onlyOwner{
        _mintBatch(to, ids, amount, "");

        for (uint i = 0; i< ids.length; i++){
            totalSupply[ids[i]] += amount[i];
        }
    }
} 