const express = require('express');
const { ethers } = require('ethers');
const app = express();

app.use(express.json());
const PORT = 3000;

// --- BLOCKCHAIN CONFIG ---
// Get a free key from Alchemy or Infura
const RPC_URL = "YOUR_ALCHEMY_OR_INFURA_URL"; 
const NFT_CONTRACT_ADDRESS = "0xYourContractAddress";
const ABI = ["function balanceOf(address owner) view returns (uint256)"];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, ABI, provider);

// Your test route
app.get('/yeboyes', (req, res) => {
    res.send('yebo yes Server is running!');
});

// --- THE GATE ROUTE ---
app.post('/verify-nft', async (req, res) => {
    try {
        const { address, signature, message } = req.body;

        // 1. Verify the signature (Proves the user owns the wallet)
        const recoveredAddress = ethers.verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ success: false, error: "Invalid signature" });
        }

        // 2. Check the NFT balance
        const balance = await nftContract.balanceOf(recoveredAddress);

        if (Number(balance) > 0) {
            res.json({ success: true, message: "Access Granted! Here is your secret content." });
        } else {
            res.status(403).json({ success: false, error: "No NFT found in this wallet." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Blockchain check failed." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});