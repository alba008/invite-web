import React from "react";
import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
  density?: "light" | "medium" | "lush";
};

export default function Frame({ children, density = "medium" }: Props) {
  const glow = density === "lush" ? 0.42 : density === "light" ? 0.28 : 0.34;

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 4,
        p: "2px",
        background:
          "linear-gradient(90deg, rgba(95,138,109,0.55), rgba(155,122,60,0.45), rgba(95,138,109,0.55))",
        backgroundSize: "200% 200%",
        animation:
          "shimmer 7s ease-in-out infinite, floaty 5.8s ease-in-out infinite",
        boxShadow: "0 26px 90px rgba(0,0,0,0.12)",
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "@keyframes floaty": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-3px)" },
          "100%": { transform: "translateY(0px)" },
        },
      }}
    >
      {/* outer glow */}
      <Box
        sx={{
          position: "absolute",
          inset: -32,
          zIndex: 0,
          filter: "blur(28px)",
          opacity: glow,
          background:
            "radial-gradient(circle at 20% 20%, rgba(120,160,135,0.55), transparent 55%), radial-gradient(circle at 80% 80%, rgba(155,122,60,0.45), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* corner florals (no middle side bouquets) */}
      <CornerFlorals />

      {/* your card */}
      <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
    </Box>
  );
}

function CornerFlorals() {
  return (
    <>
      <Floral pos="tl" />
      <Floral pos="tr" flipX />
      <Floral pos="bl" flipY />
      <Floral pos="br" flipX flipY />
    </>
  );
}

function Floral({
  pos,
  flipX,
  flipY,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  flipX?: boolean;
  flipY?: boolean;
}) {
  const placement =
    pos === "tl"
      ? { top: -26, left: -26 }
      : pos === "tr"
      ? { top: -26, right: -26 }
      : pos === "bl"
      ? { bottom: -28, left: -26 }
      : { bottom: -28, right: -26 };

  const transforms = [
    "scale(1.05)",
    flipX ? "scaleX(-1)" : "",
    flipY ? "scaleY(-1)" : "",
    pos === "bl" || pos === "br" ? "rotate(2deg)" : "rotate(-2deg)",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        zIndex: 3,
        pointerEvents: "none",
        width: 180,
        height: 180,
        opacity: 0.92,
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.10))",
        transformOrigin: "center",
        transform: transforms,
        ...placement,
      }}
    >
      <BouquetSVG />
    </Box>
  );
}

function BouquetSVG() {
  return (
    <svg viewBox="0 0 220 220" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="sage" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8CB59B" stopOpacity="0.95" />
          <stop offset="1" stopColor="#5D8A6D" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="champ" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D7B98A" stopOpacity="0.95" />
          <stop offset="1" stopColor="#9B7A3C" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="ivory" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.98" />
          <stop offset="1" stopColor="#EFE7DA" stopOpacity="0.95" />
        </radialGradient>

        <g id="petals">
          <ellipse cx="0" cy="-18" rx="10" ry="14" fill="url(#ivory)" />
          <ellipse cx="0" cy="18" rx="10" ry="14" fill="url(#ivory)" />
          <ellipse cx="-18" cy="0" rx="14" ry="10" fill="url(#ivory)" />
          <ellipse cx="18" cy="0" rx="14" ry="10" fill="url(#ivory)" />
          <ellipse
            cx="12"
            cy="-12"
            rx="10"
            ry="12"
            fill="url(#ivory)"
            opacity="0.96"
          />
          <ellipse
            cx="-12"
            cy="-12"
            rx="10"
            ry="12"
            fill="url(#ivory)"
            opacity="0.96"
          />
        </g>
      </defs>

      {/* stems */}
      <path
        d="M40 170 C70 130, 98 120, 120 98"
        fill="none"
        stroke="rgba(40,60,45,0.25)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M70 180 C92 140, 122 126, 152 98"
        fill="none"
        stroke="rgba(40,60,45,0.25)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M90 188 C112 150, 142 138, 176 110"
        fill="none"
        stroke="rgba(40,60,45,0.22)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* leaves */}
      <path
        d="M62 132 C38 118, 40 90, 70 92 C82 110, 78 140, 62 132 Z"
        fill="url(#sage)"
      />
      <path
        d="M104 118 C86 98, 104 76, 132 86 C134 106, 120 130, 104 118 Z"
        fill="url(#sage)"
        opacity="0.92"
      />
      <path
        d="M150 124 C140 92, 168 78, 188 98 C178 120, 164 132, 150 124 Z"
        fill="url(#sage)"
        opacity="0.9"
      />

      {/* flowers */}
      <g opacity="0.98">
        <Flower x={118} y={86} s={1.05} />
        <Flower x={154} y={112} s={0.9} />
        <Flower x={92} y={102} s={0.85} />
      </g>

      {/* buds */}
      <circle cx="76" cy="120" r="6" fill="url(#champ)" opacity="0.75" />
      <circle cx="174" cy="98" r="6" fill="url(#champ)" opacity="0.75" />
      <circle cx="140" cy="78" r="5" fill="url(#champ)" opacity="0.7" />
    </svg>
  );
}

function Flower({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <use href="#petals" />
      <circle cx="0" cy="0" r="7.5" fill="url(#champ)" />
      <circle cx="0" cy="0" r="3.2" fill="rgba(255,255,255,0.55)" />
    </g>
  );
}
