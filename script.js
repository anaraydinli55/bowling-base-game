let provider;
let signer;
let account;
let xp = 0;
let spins = 0;

const xpEl = document.getElementById("xp");
const spinsEl = document.getElementById("spins");

// Web3Modal Setup
const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider,
    options: {
      rpc: { 8453: "https://mainnet.base.org" }, // Base Mainnet
    }
  },
  injected: {
    package: null
  }
};

const web3Modal = new Web3Modal.default({
  cacheProvider: false,
  providerOptions
});

// Connect Wallet
document.getElementById("connectBtn").addEventListener("click", async () => {
  try {
    const instance = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(instance);
    signer = provider.getSigner();
    account = await signer.getAddress();
    alert("Wallet connected: " + account);
    console.log("Connected:", account);
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed: " + err.message);
  }
});

// SPIN Button
document.getElementById("spinBtn").addEventListener("click", async () => {
  if (!signer) {
    alert("Connect wallet first!");
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: account,
      value: ethers.parseEther("0.00001"), // demo small value
      gasLimit: 21000
    });

    console.log("TX sent:", tx.hash);

    xp += 10;
    spins += 1;
    xpEl.innerText = xp;
    spinsEl.innerText = spins;

    alert("SPIN successful!\nTX Hash: " + tx.hash);
  } catch (err) {
    console.error(err);
    alert("Transaction failed: " + err.message);
  }
});
