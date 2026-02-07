"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";

type Item = {
  id: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  kind: "petal" | "heart";
  opacity: number;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function WeddingVibe({
  intensity = 18,
  mode = "fixed",
  zIndex = 0,
  opacity = 1,
  clipRadius,
}: {
  intensity?: number;
  mode?: "fixed" | "absolute";
  zIndex?: number;
  opacity?: number;
  clipRadius?: number;
}) {
  const reduced = usePrefersReducedMotion();

  const items = useMemo<Item[]>(() => {
    const arr: Item[] = [];
    for (let i = 0; i < intensity; i++) {
      const kind: Item["kind"] = Math.random() < 0.72 ? "petal" : "heart";
      arr.push({
        id: uid(),
        left: Math.random() * 100,
        size: kind === "heart" ? 10 + Math.random() * 10 : 14 + Math.random() * 16,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 7,
        drift: (Math.random() * 2 - 1) * 90,
        rotate: (Math.random() * 2 - 1) * 120,
        opacity: 0.35 + Math.random() * 0.45,
        kind,
      });
    }
    return arr;
  }, [intensity]);

  if (reduced) return null;

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: mode,
        inset: 0,
        zIndex,
        pointerEvents: "none",
        overflow: "hidden",
        opacity,
        borderRadius: clipRadius ? `${clipRadius}px` : undefined,
        "@keyframes fall": {
          "0%": { transform: "translate3d(var(--dx), -12vh, 0) rotate(0deg)", opacity: 0 },
          "10%": { opacity: 1 },
          "100%": {
            transform: "translate3d(calc(var(--dx) * -1), 112vh, 0) rotate(var(--rot))",
            opacity: 0,
          },
        },
      }}
    >
      {items.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.08))",
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
            "--dx": `${p.drift}px`,
            "--rot": `${p.rotate}deg`,
          }}
        >
          {p.kind === "petal" ? <Petal /> : <Heart />}
        </Box>
      ))}
    </Box>
  );
}

function Petal() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(155,122,60,0.70)" />
          <stop offset="1" stopColor="rgba(95,138,109,0.65)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 C7 6, 4 10, 5.5 14.2 C7.2 18.9, 12 22, 12 22 C12 22, 16.8 18.9, 18.5 14.2 C20 10, 17 6, 12 2 Z"
        fill="url(#pg)"
      />
      <path
        d="M12 4 C10 8, 9 12, 12 20"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Heart() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path
        d="M12 21s-7.2-4.4-9.6-8.7C.8 9.4 2.2 6.5 5 5.6c1.9-.6 3.8.2 5 1.5 1.2-1.3 3.1-2.1 5-1.5 2.8.9 4.2 3.8 2.6 6.7C19.2 16.6 12 21 12 21z"
        fill="rgba(255, 60, 80, 0.55)"
      />
    </svg>
  );
}
