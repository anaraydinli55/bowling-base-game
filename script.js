const contractAddress = "0xcBA969E50b65515Da6D504D6dc399a59878259eC";
const contractABI = ["function spin() public"];

let provider, signer, contract;
let xp = 0, spins = 0;

async function connectWallet() {
  try {
    const web3Modal = new window.Web3Modal.default();
    const connection = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(connection);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    alert("Wallet connected: " + await signer.getAddress());
  } catch (err) {
    console.error("Wallet connect failed:", err);
    alert("Connect Wallet failed!");
  }
}

async function spin() {
  if (!contract) {
    alert("Please connect wallet first!");
    return;
  }

  try {
    const tx = await contract.spin();
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed!");

    // Frontend XP / Spins artımı
    xp += Math.floor(Math.random() * 10) + 1;
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
