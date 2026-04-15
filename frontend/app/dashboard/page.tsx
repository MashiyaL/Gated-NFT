export default function Dashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d0f",
        fontFamily: "'Courier New', monospace",
      }}
    >
      <div
        style={{
          background: "#16161a",
          border: "1px solid #2a2a35",
          borderRadius: 16,
          padding: "48px 40px",
          width: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 0 60px rgba(100,80,255,0.08)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48 }}>🏠</div>
        <h1 style={{ color: "#f0eeff", fontSize: 24, fontWeight: 700, margin: 0 }}>
          Welcome to the Dashboard
        </h1>
        <p style={{ color: "#6b6b80", fontSize: 13, margin: 0 }}>
          You have successfully verified NFT ownership and gained access.
        </p>
      </div>
    </main>
  );
}
