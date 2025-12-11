let xp = 0;
let throwsCount = 0;
let signer;

// Web3Modal Setup (MetaMask, Rabby, Coinbase, WalletConnect)
const web3Modal = new window.Web3Modal.default({
  cacheProvider: false,
  theme: "dark",
  providerOptions: {
    injected: { package: null }, // MetaMask, Rabby, Coinbase
    walletconnect: {
      package: window.WalletConnectProvider,
      options: {
        rpc: {
          8453: "https://mainnet.base.org" // Base Mainnet
        }
      }
    }
  }
});

// Connect Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  try {
    const providerInstance = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(providerInstance);
    signer = await provider.getSigner();
    const account = await signer.getAddress();
    alert("Wallet connected: " + account);
    console.log("Signer ready:", signer);
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed: " + err.message);
  }
});

// Throw / TX Base Mainnet (demo low fee)
document.getElementById("throwBtn").addEventListener("click", async () => {
  if (!signer) return alert("Connect your wallet first");

  try {
    const account = await signer.getAddress();

    // Demo TX: kendine küçük miktar ETH gönder
    const tx = await signer.sendTransaction({
      to: account,
      value: ethers.parseEther("0.00001"),
      gasLimit: 21000
    });

    console.log("TX sent:", tx.hash);
    alert("Throw sent! TX hash: " + tx.hash);

    // TX başarılı olunca XP ve Throws artır
    throwsCount++;
    xp += 10;
    document.getElementById("throws").textContent = throwsCount;
    document.getElementById("xp").textContent = xp;

  } catch (err) {
    console.error(err);
    alert("TX failed: " + err.message);
  }
});
