require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { ethers } = require('ethers');
const path = require('path');
const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://gated-nft.vercel.app'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const PORT = 3001;

const CONTRACT_ADDRESS = "0x3D85bEd021B69142D649896EE3D684C9aC55354f";
const RPC_URL = process.env.SEPOLIA_RPC_URL;
const REQUIRED_TOKEN_ID = 0;

const ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);


app.get('/api/message', (req, res) => {
  const message = `Sign in to ABC NFT\nTimestamp: ${Date.now()}`;
  res.json({ message });
});

app.post('/api/verify', async (req, res) => {
  const { message, signature } = req.body;
  if (!message || !signature) return res.status(400).json({ error: 'Missing fields' });

  try {
    const address = ethers.verifyMessage(message, signature);
    const balance = await contract.balanceOf(address, REQUIRED_TOKEN_ID);

    if (balance > 0) {
      res.json({ access: true, address });
    } else {
      res.json({ access: false, address, reason: 'No NFT found in this wallet' });
    }
  } catch (e) {
    res.status(400).json({ error: 'Invalid signature' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
