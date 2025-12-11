const connectWalletBtn = document.getElementById("connectWallet");

async function signMessage(account, message) {
  const msg = `Sign this message to confirm: ${message}`;
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [msg, account],
  });
  console.log("Signature:", signature);
  return signature;
}

connectWalletBtn.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const signature = await signMessage(account, "Base Bowling XP");
      alert("Wallet connected & message signed! Check console for signature.");
    } catch (err) {
      console.error(err);
      alert("Connection or signing failed");
    }
  } else {
    alert("Please install MetaMask or another EVM-compatible wallet");
  }
});
