import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import Web3Modal from "https://cdn.jsdelivr.net/npm/web3modal@1.9.12/dist/index.js";

const contractAddress = "0xcBA969E50b65515Da6D504D6dc399a59878259eC";
const contractABI = [
  "function spin() public"
];

let provider;
let signer;
let contract;

let xp = 0;
let spins = 0;

async function connectWallet() {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  provider = new ethers.providers.Web3Provider(connection);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);
  alert("Wallet connected: " + await signer.getAddress());
}

async function spin() {
  if (!contract) {
    alert("Please connect wallet first!");
    return;
  }

  try {
    // TX blockchain-ə göndərilir
    const tx = await contract.spin();
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed!");

    // Frontend XP / Spins artımı
    xp += Math.floor(Math.random() * 10) + 1; // random XP artır
    spins += 1;

    document.getElementById("xp").innerText = xp;
    document.getElementById("spins").innerText = spins;

  } catch (err) {
    console.error("Spin failed:", err);
    alert("Spin failed! See console.");
  }
}

document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("spinBtn").onclick = spin;
