let xp = 0;
let throwsCount = 0;
let signer;

// Connect Wallet
document.getElementById("connectWallet").addEventListener("click", async () => {
  if (!window.ethereum) return alert("Install MetaMask");
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const account = await signer.getAddress();
    alert("Wallet connected: " + account);
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed");
  }
});

// Throw / TX Base Mainnet
document.getElementById("throwBtn").addEventListener("click", async () => {
  if (!signer) return alert("Connect your wallet first");
  try {
    const account = await signer.getAddress();

    // Base mainnet tx: kendine küçük miktar (demo) gönder
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
