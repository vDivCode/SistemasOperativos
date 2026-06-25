"use client";

interface CollapseScreenProps {
  messageCount: number;
}

export default function CollapseScreen({ messageCount }: CollapseScreenProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#450a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        zIndex: 9999,
        textAlign: "center",
        gap: "20px",
      }}
    >
      {/* Pulsing red dot */}
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: "#ef4444",
          boxShadow: "0 0 20px #ef4444, 0 0 60px #ef444480",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />

      {/* Error code */}
      <h1
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(2rem, 10vw, 5rem)",
          fontWeight: 800,
          color: "#fecaca",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        ERROR 503
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(0.875rem, 3vw, 1.25rem)",
          fontWeight: 700,
          color: "#ef4444",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        OVERLOAD — CAPACIDAD DE SERVIDOR EXCEDIDA
      </p>

      {/* Divider */}
      <div
        style={{
          width: "80px",
          height: "2px",
          backgroundColor: "#ef444460",
        }}
      />

      {/* Stats */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          color: "#fca5a5",
          fontSize: "0.875rem",
        }}
      >
        <p>
          Mensajes recibidos:{" "}
          <span style={{ fontWeight: 700, color: "#fecaca" }}>
            {messageCount}
          </span>
        </p>
        <p>
          Estado del sistema:{" "}
          <span style={{ fontWeight: 700, color: "#ef4444" }}>
            COLAPSADO
          </span>
        </p>
      </div>

      {/* Bottom text */}
      <p
        style={{
          marginTop: "24px",
          fontSize: "0.75rem",
          color: "#7f1d1d80",
          maxWidth: "360px",
        }}
      >
        El sistema ha superado su capacidad de carga. No es posible procesar
        más solicitudes.
      </p>

      {/* CSS animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
