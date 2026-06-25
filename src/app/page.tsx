"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import MessageForm from "@/components/MessageForm";
import CollapseScreen from "@/components/CollapseScreen";

const CARRYING_CAPACITY = 30;

export default function Home() {
  const [messageCount, setMessageCount] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();

    // 1. Fetch initial count
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("mensajes")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        setMessageCount(count);
        if (count > CARRYING_CAPACITY) {
          setCollapsed(true);
        }
      } else {
        // If there's an error (e.g., table doesn't exist yet), start at 0
        setMessageCount(0);
      }
    };

    fetchCount();

    // 2. Subscribe to realtime inserts
    const channel = supabase
      .channel("mensajes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensajes" },
        (payload) => {
          console.log("Nuevo mensaje recibido en Realtime:", payload);
          setMessageCount((prev) => {
            const newCount = (prev ?? 0) + 1;
            if (newCount > CARRYING_CAPACITY) {
              setCollapsed(true);
            }
            return newCount;
          });
        }
      )
      .subscribe((status) => {
        console.log("Estado de suscripción Realtime:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Loading state
  if (messageCount === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.875rem",
        }}
      >
        Conectando al servidor...
      </div>
    );
  }

  // Collapse state
  if (collapsed) {
    return <CollapseScreen messageCount={messageCount} />;
  }

  // Normal state
  return (
    <MessageForm
      messageCount={messageCount}
      carryingCapacity={CARRYING_CAPACITY}
    />
  );
}
