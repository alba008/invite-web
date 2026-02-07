"use client";

import React from "react";
import { Box } from "@mui/material";

type Density = "light" | "medium" | "lush";
type Theme = "classic" | "bonbon";

const THEMES: Record<Theme, { blush: string; rose: string; berry: string; sage: string; ink: string }> = {
  classic: {
    blush: "#E7C7CC",
    rose: "#C97986",
    berry: "#7C2A35",
    sage: "#6F8A77",
    ink: "rgba(10,10,10,0.22)",
  },
  bonbon: {
    blush: "#D59EAC",
    rose: "#D55567",
    berry: "#9F1F2E",
    sage: "#5C665D",
    ink: "rgba(10,10,10,0.22)",
  },
};

function scaleFor(density: Density) {
  if (density === "light") return 0.82;
  if (density === "lush") return 1.18;
  return 1.0;
}

function opacityFor(density: Density) {
  if (density === "light") return 0.55;
  if (density === "lush") return 0.92;
  return 0.75;
}

function FloralCorner({
  pos,
  density,
  theme,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  density: Density;
  theme: Theme;
}) {
  const t = THEMES[theme];
  const s = scaleFor(density);
  const op = opacityFor(density);

  // ✅ unique IDs so multiple corners don't clash in DOM
  const uid = `${theme}_${pos}`;

  const placement =
    pos === "tl"
      ? { top: -26, left: -26, transform: `rotate(-6deg) scale(${s})` }
      : pos === "tr"
      ? { top: -26, right: -26, transform: `scaleX(-1) rotate(-6deg) scale(${s})` }
      : pos === "bl"
      ? { bottom: -28, left: -28, transform: `scaleY(-1) rotate(-6deg) scale(${s})` }
      : { bottom: -28, right: -28, transform: `scale(-1) rotate(-6deg) scale(${s})` };

  return (
    <Box
      sx={{
        position: "absolute",
        width: 260,
        height: 210,
        pointerEvents: "none",
        opacity: op,
        filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.10))",
        ...placement,
      }}
    >
      <svg viewBox="0 0 260 210" width="260" height="210" aria-hidden="true">
        <defs>
          <radialGradient id={`petal_blush_${uid}`} cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor={t.blush} stopOpacity="1" />
            <stop offset="1" stopColor={t.rose} stopOpacity="0.9" />
          </radialGradient>

          <radialGradient id={`petal_rose_${uid}`} cx="45%" cy="35%" r="70%">
            <stop offset="0" stopColor={t.rose} stopOpacity="1" />
            <stop offset="1" stopColor={t.berry} stopOpacity="0.85" />
          </radialGradient>

          <linearGradient id={`leaf_${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={t.sage} stopOpacity="0.95" />
            <stop offset="1" stopColor="#2F3A33" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* stems */}
        <path
          d="M78 168 C98 138, 122 128, 150 110"
          fill="none"
          stroke={t.ink}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M95 176 C122 152, 152 140, 198 116"
          fill="none"
          stroke={t.ink}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* leaves */}
        <path
          d="M134 120 C150 100, 174 98, 184 116 C166 132, 150 136, 134 120 Z"
          fill={`url(#leaf_${uid})`}
          opacity="0.9"
        />
        <path
          d="M160 104 C178 88, 204 90, 210 112 C190 124, 176 124, 160 104 Z"
          fill={`url(#leaf_${uid})`}
          opacity="0.82"
        />
        <path
          d="M92 142 C104 120, 128 118, 138 136 C122 152, 106 156, 92 142 Z"
          fill={`url(#leaf_${uid})`}
          opacity="0.78"
        />

        {/* big blush flower */}
        <g transform="translate(34 74)">
          <path
            d="M70 30 C60 6, 92 2, 86 26 C104 8, 124 28, 98 40 C126 44, 112 74, 88 56 C94 82, 62 84, 66 56 C46 74, 26 54, 52 42 C24 38, 38 10, 62 26 Z"
            fill={`url(#petal_blush_${uid})`}
            opacity="0.95"
          />
          <circle cx="78" cy="44" r="7" fill={t.berry} opacity="0.32" />
          <circle cx="88" cy="42" r="4.5" fill={t.berry} opacity="0.18" />
        </g>

        {/* rose flower */}
        <g transform="translate(118 40)">
          <path
            d="M58 26 C54 8, 80 4, 76 24 C90 12, 106 28, 86 38 C110 44, 96 66, 76 52 C78 74, 54 76, 56 52 C40 66, 24 52, 40 40 C18 36, 28 14, 52 22 Z"
            fill={`url(#petal_rose_${uid})`}
            opacity="0.95"
          />
          <circle cx="70" cy="40" r="6" fill={t.berry} opacity="0.84" />
        </g>

        {/* small berry blossoms */}
        <circle cx="214" cy="82" r="5" fill={t.berry} opacity="0.55" />
        <circle cx="226" cy="74" r="4" fill={t.berry} opacity="0.40" />
        <circle cx="200" cy="92" r="4.5" fill={t.berry} opacity="0.35" />
      </svg>
    </Box>
  );
}

export default function StaticFlorals({
  density = "medium",
  theme = "classic",
}: {
  density?: Density;
  theme?: Theme;
}) {
  return (
    <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <FloralCorner pos="tl" density={density} theme={theme} />
      <FloralCorner pos="tr" density={density} theme={theme} />
      <FloralCorner pos="bl" density={density} theme={theme} />
      <FloralCorner pos="br" density={density} theme={theme} />
    </Box>
  );
}
