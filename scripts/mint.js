
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const CONTRACT_ADDRESS = "0x3D85bEd021B69142D649896EE3D684C9aC55354f";
  const nft = await ethers.getContractAt("NFT", CONTRACT_ADDRESS);

  const tx = await nft.mint("0x2F41783A1dD6a7Ad55b09aa97ef56d225a8706b0");
  await tx.wait();
  console.log("Minted successfully to 0x2F41783A1dD6a7Ad55b09aa97ef56d225a8706b0");
}

main().catch(console.error);
