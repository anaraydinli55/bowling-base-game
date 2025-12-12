// ---------------- Web3Modal + wagmi Setup ----------------
const { createWeb3Modal, defaultWagmiConfig } = window.WagmiCore
const { base } = window.WagmiChains

const projectId = "1e6f9df47fe3977ed912d899ab123456"

const metadata = {
  name: "Bowling Spin",
  description: "Base Mainnet Spin Game",
  url: window.location.href,
  icons: ["https://web3modal.com/images/logo.png"]
}

const chains = [base]

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata
})

// Create Web3Modal popup
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains
})

// ---------------- APP STATE ----------------
let account = null
let provider = null
let signer = null
let xp = 0
let spins = 0

const xpEl = document.getElementById("xp")
const spinsEl = document.getElementById("spins")

// ---------------- CONNECT WALLET ----------------
document.getElementById("connectBtn").addEventListener("click", () => {
  window.openWeb3Modal() // opens wallet list popup
})

// Subscribe to wallet connection
wagmiConfig.subscribe(() => {
  const state = wagmiConfig.getState()
  if (state.status === "connected") {
    account = state.current.account.address
    provider = new ethers.BrowserProvider(state.current.provider)
    signer = provider.getSigner()
    console.log("Wallet connected:", account)
  }
})

// ---------------- SPIN BUTTON ----------------
document.getElementById("spinBtn").addEventListener("click", async () => {
  if (!signer) return alert("Connect wallet first!")

  try {
    const address = await signer.getAddress()

    // Auto gas, low fee Base Mainnet
    const tx = await signer.sendTransaction({
      to: address,
      value: 0n // cheapest self-transfer
    })

    console.log("TX sent:", tx.hash)

    xp += 10
    spins += 1
    xpEl.innerText = xp
    spinsEl.innerText = spins

    alert("SPIN successful!\nTX Hash: " + tx.hash)

  } catch (err) {
    console.error("TX failed:", err)
    alert("Transaction failed or rejected")
  }
})
