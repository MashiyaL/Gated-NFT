"use client";
import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

const SERVER = "https://gated-nft.onrender.com";

type Status = "idle" | "connecting" | "checking" | "granted" | "denied" | "error";

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) window.location.href = "/exit";
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("error");
      setMessage("MetaMask not found. Please install it.");
      return;
    }
    setStatus("connecting");
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setWallet(signer.address);
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage("Wallet connection rejected.");
    }
  }

  async function checkAccess() {
    if (!wallet || !window.ethereum) return;
    setStatus("checking");
    setMessage("");
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const msgRes = await fetch(`${SERVER}/api/message`);
      const { message: msg } = await msgRes.json();

      const signature = await signer.signMessage(msg);

      const verRes = await fetch(`${SERVER}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, signature }),
      });
      const data = await verRes.json();

      if (data.access) {
        setStatus("granted");
        setMessage(`Access granted for ${shortAddr(data.address)}`);
        setShowPopup(true);
      } else {
        setStatus("denied");
        setMessage(data.reason || "No NFT found in this wallet.");
      }
    } catch (e: unknown) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  const isChecking = status === "checking";
  const isConnecting = status === "connecting";

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #e8fdf8;
          font-family: 'Share Tech Mono', monospace;
          color: #0a3d35;
        }

        .app {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,180,140,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,140,0.12) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .bg-blob {
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,210,170,0.18) 0%, transparent 70%);
          top: -150px; right: -150px;
          pointer-events: none;
          z-index: 0;
        }

        .bg-blob2 {
          position: fixed;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,210,170,0.12) 0%, transparent 70%);
          bottom: -100px; left: -80px;
          pointer-events: none;
          z-index: 0;
        }

        /* NAVBAR */
        .navbar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 54px;
          background: rgba(255,255,255,0.75);
          border-bottom: 2px solid rgba(0,180,140,0.3);
          backdrop-filter: blur(8px);
        }

        .nav-logo {
          font-family: 'Orbitron', sans-serif;
          font-size: 15px;
          font-weight: 900;
          color: #00b48a;
          letter-spacing: 3px;
        }

        .nav-logo span { color: #ff6b35; }

        .nav-chain {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #00b48a;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        @keyframes blink {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.8); }
        }

        .chain-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00d4aa;
          animation: blink 2s infinite;
        }

        .nav-wallet-btn {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #fff;
          background: #00b48a;
          border: none;
          padding: 6px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .nav-wallet-btn:hover { background: #009a78; }
        .nav-wallet-btn.disconnected { background: #b2ddd5; color: #006e56; }

        /* HERO */
        .hero {
          position: relative;
          z-index: 5;
          text-align: center;
          padding: 56px 2rem 40px;
        }

        .hero-eyebrow {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 5px;
          color: #ff6b35;
          margin-bottom: 16px;
        }

        .hero-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(26px, 5vw, 44px);
          font-weight: 900;
          color: #003d30;
          letter-spacing: 1px;
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .hero-title .teal { color: #00b48a; }

        .hero-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #5a9e90;
          letter-spacing: 2px;
          margin-bottom: 36px;
        }

        .contract-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.8);
          border: 1.5px solid rgba(0,180,140,0.35);
          padding: 8px 18px;
          font-size: 11px;
          letter-spacing: 1px;
          margin-bottom: 44px;
        }

        .pill-label { color: #aaa; font-size: 9px; letter-spacing: 2px; }
        .pill-addr { color: #00b48a; font-weight: 700; }

        /* PANELS */
        .panels {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 0 2rem 2rem;
          max-width: 820px;
          margin: 0 auto;
        }

        @media (max-width: 600px) {
          .panels { grid-template-columns: 1fr; }
        }

        .panel {
          background: rgba(255,255,255,0.85);
          border: 1.5px solid rgba(0,180,140,0.25);
          padding: 24px;
          backdrop-filter: blur(4px);
        }

        .panel-eyebrow {
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #00b48a;
          opacity: 0.7;
          margin-bottom: 6px;
        }

        .panel-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 12px;
          font-weight: 900;
          color: #003d30;
          letter-spacing: 1px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1.5px solid rgba(0,180,140,0.15);
        }

        .status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid rgba(0,180,140,0.1);
          font-size: 11px;
        }

        .status-row:last-of-type { border-bottom: none; }
        .skey { color: #7ab8ae; letter-spacing: 1px; }
        .sval { color: #003d30; font-weight: 700; }
        .sval-green { color: #00b48a; font-weight: 700; }
        .sval-orange { color: #ff6b35; font-weight: 700; }
        .sval-muted { color: #aaa; font-weight: 700; }

        /* BUTTON */
        .btn-main {
          width: 100%;
          margin-top: 20px;
          padding: 13px;
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          border: 2px solid #00b48a;
          background: #00b48a;
          color: #fff;
          transition: all 0.2s;
        }

        .btn-main:hover:not(:disabled) { background: #009a78; border-color: #009a78; }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-outline {
          width: 100%;
          margin-top: 8px;
          padding: 11px;
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          border: 1.5px solid rgba(0,180,140,0.4);
          background: transparent;
          color: #00b48a;
          transition: all 0.2s;
        }

        .btn-outline:hover { background: rgba(0,180,140,0.08); }

        /* NFT FRAME */
        .nft-frame {
          background: linear-gradient(135deg, #e8fdf8, #c8f5ec);
          border: 1.5px solid rgba(0,180,140,0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 28px;
          gap: 14px;
          position: relative;
          margin-bottom: 16px;
        }

        .cm { position: absolute; width: 12px; height: 12px; }
        .cm-tl { top:8px; left:8px; border-top:2px solid #00b48a; border-left:2px solid #00b48a; }
        .cm-tr { top:8px; right:8px; border-top:2px solid #00b48a; border-right:2px solid #00b48a; }
        .cm-bl { bottom:8px; left:8px; border-bottom:2px solid #00b48a; border-left:2px solid #00b48a; }
        .cm-br { bottom:8px; right:8px; border-bottom:2px solid #00b48a; border-right:2px solid #00b48a; }

        .nft-token-id {
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #7ab8ae;
        }

        /* BANNERS */
        .banner {
          width: 100%;
          padding: 11px 14px;
          font-size: 11px;
          letter-spacing: 1px;
          text-align: center;
          margin-top: 12px;
          font-family: 'Share Tech Mono', monospace;
        }

        .banner-denied { background: rgba(255,107,53,0.1); border: 1.5px solid rgba(255,107,53,0.3); color: #cc4400; }
        .banner-granted { background: rgba(0,180,140,0.1); border: 1.5px solid rgba(0,180,140,0.4); color: #006e56; }
        .banner-checking { background: rgba(0,180,140,0.06); border: 1.5px solid rgba(0,180,140,0.2); color: #5a9e90; }
        .banner-error { background: rgba(255,107,53,0.1); border: 1.5px solid rgba(255,107,53,0.3); color: #cc4400; }

        /* TICKER */
        .ticker {
          position: relative;
          z-index: 5;
          border-top: 1.5px solid rgba(0,180,140,0.2);
          background: rgba(255,255,255,0.6);
          padding: 9px 2rem;
          display: flex;
          gap: 2rem;
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #aad4cc;
          overflow: hidden;
          flex-wrap: wrap;
        }

        .tick-val { color: #00b48a; }

        /* POPUP */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,60,45,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        .popup {
          background: #fff;
          border: 2px solid #00b48a;
          padding: 40px 32px;
          width: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }

        .popup-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #003d30;
          letter-spacing: 1px;
        }

        .popup-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #7ab8ae;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="app">
        <div className="bg-grid" />
        <div className="bg-blob" />
        <div className="bg-blob2" />

        {/* NAVBAR */}
        <nav className="navbar">
          <div className="nav-logo">ABC<span>NFT</span></div>
          <div className="nav-chain">
            <div className="chain-dot" />
            SEPOLIA TESTNET
          </div>
          <button
            className={`nav-wallet-btn${wallet ? "" : " disconnected"}`}
            onClick={!wallet ? connectWallet : undefined}
            disabled={isConnecting}
          >
            {wallet ? shortAddr(wallet) : isConnecting ? "CONNECTING…" : "CONNECT WALLET"}
          </button>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-eyebrow">// TOKEN GATED ACCESS PROTOCOL //</div>
          <div className="hero-title">
            HOLD THE <span className="teal">TOKEN</span><br />UNLOCK THE GATE
          </div>
          <div className="hero-sub">
            ERC-721 · NON-TRANSFERABLE · ON-CHAIN VERIFICATION
          </div>
          <div className="contract-pill">
            <span className="pill-label">CONTRACT</span>
            <span className="pill-addr">0x3D85...354f</span>
            <span className="pill-label">SEPOLIA</span>
          </div>
        </div>

        {/* PANELS */}
        <div className="panels">
          {/* Left — Wallet Status */}
          <div className="panel">
            <div className="panel-eyebrow">01 // WALLET</div>
            <div className="panel-title">IDENTITY VERIFICATION</div>

            <div className="status-row">
              <span className="skey">CONNECTION</span>
              <span className={wallet ? "sval-green" : "sval-orange"}>
                {wallet ? "CONNECTED" : "NOT CONNECTED"}
              </span>
            </div>
            <div className="status-row">
              <span className="skey">NETWORK</span>
              <span className="sval-green">SEPOLIA</span>
            </div>
            <div className="status-row">
              <span className="skey">ADDRESS</span>
              <span className={wallet ? "sval" : "sval-muted"}>
                {wallet ? shortAddr(wallet) : "—"}
              </span>
            </div>
            <div className="status-row">
              <span className="skey">NFT BALANCE</span>
              <span className={status === "granted" ? "sval-green" : "sval-muted"}>
                {status === "granted" ? "1 NFT" : "—"}
              </span>
            </div>
            <div className="status-row">
              <span className="skey">ACCESS LEVEL</span>
              <span className={status === "granted" ? "sval-green" : "sval-orange"}>
                {status === "granted" ? "GRANTED" : "DENIED"}
              </span>
            </div>

            {(status === "error" || status === "denied") && (
              <div className={`banner banner-${status}`}>
                {status === "denied" ? "✕ " : "⚠ "}{message}
              </div>
            )}

            <button
              className="btn-main"
              onClick={!wallet ? connectWallet : checkAccess}
              disabled={isConnecting || isChecking || status === "granted"}
            >
              {isConnecting
                ? "CONNECTING…"
                : isChecking
                ? "CHECKING…"
                : status === "granted"
                ? "VERIFIED ✓"
                : !wallet
                ? "CONNECT WALLET"
                : "VERIFY OWNERSHIP"}
            </button>
          </div>

          {/* Right — NFT Preview */}
          <div className="panel">
            <div className="panel-eyebrow">02 // NFT PASS</div>
            <div className="panel-title">ACCESS TOKEN</div>

            <div className="nft-frame">
              <div className="cm cm-tl" />
              <div className="cm cm-tr" />
              <div className="cm cm-bl" />
              <div className="cm cm-br" />

              <svg width="90" height="90" viewBox="0 0 90 90">
                <polygon points="45,5 82,25 82,65 45,85 8,65 8,25" fill="none" stroke="rgba(0,180,140,0.35)" strokeWidth="1.5" />
                <polygon points="45,15 72,30 72,60 45,75 18,60 18,30" fill="none" stroke="rgba(0,180,140,0.2)" strokeWidth="1" />
                <circle cx="45" cy="45" r="16" fill="rgba(0,180,140,0.12)" stroke="rgba(0,180,140,0.4)" strokeWidth="1.5" />
                <text x="45" y="51" textAnchor="middle" fontFamily="Orbitron,sans-serif" fontSize="12" fontWeight="900" fill="#00b48a">ABC</text>
              </svg>

              <div className="nft-token-id">
                {status === "granted" ? "TOKEN ID: VERIFIED" : "TOKEN ID: ????"}
              </div>
            </div>

            <div className={`banner ${
              status === "granted" ? "banner-granted"
              : isChecking ? "banner-checking"
              : "banner-denied"
            }`}>
              {status === "granted"
                ? "✓ NFT VERIFIED — ACCESS UNLOCKED"
                : isChecking
                ? "⟳ QUERYING BLOCKCHAIN…"
                : "⬡ CONNECT WALLET TO VERIFY OWNERSHIP"}
            </div>
          </div>
        </div>

        {/* TICKER */}
        <div className="ticker">
          <span>BLOCK <span className="tick-val">#7,841,203</span></span>
          <span>GAS <span className="tick-val">12 GWEI</span></span>
          <span>CONTRACT <span className="tick-val">VERIFIED</span></span>
          <span>STANDARD <span className="tick-val">ERC-721</span></span>
          <span>NETWORK <span className="tick-val">SEPOLIA</span></span>
        </div>

        {/* ACCESS GRANTED POPUP */}
        {showPopup && (
          <div className="overlay">
            <div className="popup">
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="rgba(0,180,140,0.12)" stroke="#00b48a" strokeWidth="2" />
                <polyline points="14,26 22,34 38,18" fill="none" stroke="#00b48a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="popup-title">ACCESS GRANTED</div>
              <div className="popup-sub">NFT ownership verified on-chain.</div>
              <div className="popup-sub">{message}</div>
              <button
                className="btn-main"
                onClick={() => (window.location.href = "/dashboard")}
              >
                ENTER DASHBOARD →
              </button>
              <button
                className="btn-outline"
                onClick={() => setShowPopup(false)}
              >
                DISMISS
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}