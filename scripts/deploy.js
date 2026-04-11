const {ethers} = require("hardhat");

async function main(){
    const [deployer, user1] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy("null");
    await nft.waitForDeployment();

    const nftAddress = await nft.getAddress();
    console.log("Address: ", nftAddress);

}
main().catch(console.error);