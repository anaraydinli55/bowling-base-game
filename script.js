// Ethers.js Base tx için
async function sendThrowTx() {
  if (!window.ethereum) return alert("Install MetaMask or compatible wallet");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const account = await signer.getAddress();

  // Örnek: Base testnet üzerindeki dummy contract veya hesap adresine 0 ETH göndermek
  try {
    const tx = await signer.sendTransaction({
      to: account, // kendine gönder, demo amaçlı
      value: ethers.utils.parseEther("0.0001"), // küçük miktar
      gasLimit: 21000
    });
    console.log("TX sent:", tx.hash);
    alert(`Throw sent! TX hash: ${tx.hash}`);

    // TX başarılı olunca XP ve Throws artır
    throwsCount++;
    xp += 10;
    document.getElementById("throws").textContent = throwsCount;
    document.getElementById("xp").textContent = xp;

  } catch (err) {
    console.error(err);
    alert("TX failed: " + err.message);
  }
}

document.getElementById("throwBtn").addEventListener("click", sendThrowTx);
