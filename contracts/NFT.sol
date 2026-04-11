// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155, Ownable {
    uint256 public nextTokenId;
    string public baseURI;

    constructor(string memory _baseURI) ERC721("ABC", "ABC") {
        baseURI = _baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function mint(address to) public onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amount) public onlyOnwer{
        _mintBatch(to, id, amounts, "");

        for (uint i = 0; i< ids.length; i++){
            totalSupply[ids[i]] += amounts[i];
        }
    }
} 