let provider;
let signer;
let account;
let xp = 0;
let spins = 0;

const xpEl = document.getElementById("xp");
const spinsEl = document.getElementById("spins");

// Web3Modal Setup
const web3Modal = new window.Web3Modal.default({
  cacheProvider: false,
  theme: "dark",
  providerOptions: {
    injected: { package: null }, // MetaMask, Rabby, Coinbase
    walletconnect: {
      package: window.WalletConnectProvider,
      options: {
        rpc: { 8453: "https://mainnet.base.org" } // Base Mainnet
      }
    }
  }
});

// Connect Wallet
document.getElementById("connectBtn").addEventListener("click", async () => {
  try {
    const instance = await web3Modal.connect();
    provider = new ethers.BrowserProvider(instance);
    signer = await provider.getSigner();
    account = await signer.getAddress();
    console.log("Wallet connected:", account);
    alert("Wallet connected: " + account);
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
      value: 0n // cheapest self-transfer
    });

    console.log("TX sent:", tx.hash);

    xp += 10;
    spins += 1;
    xpEl.innerText = xp;
    spinsEl.innerText = spins;

    alert("SPIN successful!\nTX: " + tx.hash);
  } catch (err) {
    console.error(err);
    alert("TX failed: " + err.message);
  }
});
