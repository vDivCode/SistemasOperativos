"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface MessageFormProps {
  messageCount: number;
  carryingCapacity: number;
}

export default function MessageForm({
  messageCount,
  carryingCapacity,
}: MessageFormProps) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed || status === "sending") return;

    setStatus("sending");
    setText("");

    const { error } = await supabase.from("mensajes").insert({ texto: trimmed });

    if (error) {
      setStatus("error");
    } else {
      setStatus("sent");
    }

    // Clear the status after 2 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
    }, 2000);

    // Refocus input for rapid-fire sending
    inputRef.current?.focus();
  };

  const progress = Math.min((messageCount / carryingCapacity) * 100, 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        gap: "32px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: "8px",
          }}
        >
          📡 Sistema de Mensajes
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
          }}
        >
          Envía un mensaje al servidor
        </p>
      </div>

      {/* Capacity indicator */}
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            marginBottom: "6px",
          }}
        >
          <span>Carga del sistema</span>
          <span>
            {messageCount} / {carryingCapacity}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "var(--color-border)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor:
                progress < 60
                  ? "var(--color-success)"
                  : progress < 85
                  ? "#eab308"
                  : "#ef4444",
              borderRadius: "3px",
              transition: "width 0.3s ease, background-color 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ingresa un mensaje"
          autoComplete="off"
          maxLength={280}
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: "1rem",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            color: "var(--color-text)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={!text.trim() || status === "sending"}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "1rem",
            fontWeight: 600,
            backgroundColor:
              !text.trim() || status === "sending"
                ? "var(--color-border)"
                : "var(--color-accent)",
            color:
              !text.trim() || status === "sending"
                ? "var(--color-text-muted)"
                : "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor:
              !text.trim() || status === "sending"
                ? "not-allowed"
                : "pointer",
          }}
        >
          {status === "sending" ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {/* Status message */}
      <div style={{ height: "24px", textAlign: "center" }}>
        {status === "sent" && (
          <p
            style={{
              color: "var(--color-success)",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            ✓ Mensaje enviado
          </p>
        )}
        {status === "error" && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            ✗ Error al enviar. Intenta de nuevo.
          </p>
        )}
      </div>
    </div>
  );
}
