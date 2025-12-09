let provider, signer, contract;
const contractAddress = "SENIN_CONTRACT_ADRESIN"; // Remix deploy sonrası
const contractABI = [
  "function bowl() external",
  "function getPlayer(address player) view returns(uint256,uint256)",
  "event Bowled(address indexed player, uint256 totalXp, uint256 totalThrows)"
];

// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./public/bowling.png";

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
    updatePlayerInfo();
  } else {
    alert("MetaMask / Base wallet required!");
  }
}

// Throw button
document.getElementById("throwBtn").onclick = async () => {
  if (!contract) return alert("Connect wallet first!");
  try {
    const tx = await contract.bowl();
    await tx.wait();
    console.log("Throw sent:", tx.hash);
  } catch (e) {
    console.error(e);
    alert("Transaction failed!");
  }
}

// Update XP and Throws
async function updatePlayerInfo() {
  if (!signer) return;
  const address = await signer.getAddress();
  const [xp, throwsCount] = await contract.getPlayer(address);
  document.getElementById("xp").innerText = xp;
  document.getElementById("throws").innerText = throwsCount;
}

// Listen events
if (typeof contract !== "undefined") {
  contract.on("Bowled", (player, totalXp, totalThrows) => {
    updatePlayerInfo();
  });
}
