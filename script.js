import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.8.0/dist/ethers.min.js";

const contractAddress = "0xcBA969E50b65515Da6D504D6dc399a59878259eC"; // Remix deploy sonrası
const contractABI = [
  "function bowl() external",
  "function getPlayer(address player) view returns(uint256,uint256)",
  "event Bowled(address indexed player, uint256 totalXp, uint256 totalThrows)"
];

let provider, signer, contract;

// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "/bowling.png";  // Vercel uyumlu
img.onload = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// Wallet Connect
document.getElementById("connectWallet").onclick = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    alert("Wallet connected!");
    await updatePlayerInfo();
    listenEvents();
  } else {
    alert("MetaMask veya Base Wallet gerekiyor!");
  }
};

// Throw button
document.getElementById("throwBtn").onclick = async () => {
  if (!contract) return alert("Connect wallet first!");
  try {
    const tx = await contract.bowl();
    await tx.wait();               // TX tamamlanmasını bekle
    await updatePlayerInfo();      // XP ve throw sayısını güncelle
  } catch (e) {
    console.error(e);
    alert("Transaction failed!");
  }
};

// Update XP and Throws
async function updatePlayerInfo() {
  if (!signer || !contract) return;
  const address = await signer.getAddress();
  const [xp, throwsCount] = await contract.getPlayer(address);
  document.getElementById("xp").innerText = xp;
  document.getElementById("throws").innerText = throwsCount;
}

// Listen events
function listenEvents() {
  if (!contract) return;
  contract.on("Bowled", (player, totalXp, totalThrows) => {
    updatePlayerInfo();
  });
}

