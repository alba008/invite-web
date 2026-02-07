"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Box, Chip, Divider, Paper, Stack, Typography, alpha } from "@mui/material";

import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalBarRoundedIcon from "@mui/icons-material/LocalBarRounded";
import ChurchRoundedIcon from "@mui/icons-material/ChurchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import RSVPCTA from "@/app/components/RSVPCTA";
import StaticFlorals from "@/app/components/StaticFlorals";
import Frame from "@/app/components/Frame";

const WeddingVibe = dynamic(() => import("@/app/components/WeddingVibe"), { ssr: false });
const Countdown = dynamic(() => import("@/app/components/Countdown"), { ssr: false });

type EventData = {
  verse: string;
  familiesLine: string;
  coupleLeft: string;
  coupleRight: string;
  surnameLeft: string;
  surnameRight: string;
  dateISO: string;
  dateText: string;
  accessCode: string;
  footerLine: string;
  contacts: { name: string; phone: string }[];
  schedule: {
    title: string;
    time: string;
    place: string;
    address: string;
    kind: "home" | "church" | "party";
    accent?: boolean;
  }[];
};

/** Bon-Bon romance palette */
const PALETTE = {
  ink: "#1F1E1C",
  gold: "#C6A05E",
  goldDeep: "#9A9462",
  blush: "#D59EAC",
  rose: "#D55567",
  berry: "#9F1F2E",
  sage: "#5C665D",
  sageSoft: "#75866A",
  glass: "rgba(255,255,255,0.72)",
};

function LeafCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const placement =
    pos === "tl"
      ? { top: -18, left: -14, transform: "rotate(-10deg)" }
      : pos === "tr"
      ? { top: -20, right: -14, transform: "scaleX(-1) rotate(-12deg)" }
      : pos === "bl"
      ? { bottom: -22, left: -14, transform: "scaleY(-1) rotate(-8deg)" }
      : { bottom: -24, right: -14, transform: "scale(-1) rotate(-10deg)" };

  const gradId = `leafG_bonbon_${pos}`;

  return (
    <Box
      sx={{
        position: "absolute",
        width: 120,
        height: 120,
        opacity: 0.26,
        pointerEvents: "none",
        filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.10))",
        zIndex: 0,
        ...placement,
      }}
    >
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={PALETTE.sageSoft} />
            <stop offset="1" stopColor={PALETTE.sage} />
          </linearGradient>
        </defs>

        <path
          d="M60 112 C54 80, 42 64, 20 48"
          fill="none"
          stroke="rgba(20,30,24,0.22)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M60 112 C66 80, 80 62, 102 48"
          fill="none"
          stroke="rgba(20,30,24,0.22)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M28 56 C20 38, 38 24, 54 34 C52 54, 36 64, 28 56 Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M92 56 C100 38, 82 24, 66 34 C68 54, 84 64, 92 56 Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M52 34 C50 18, 68 12, 80 26 C70 40, 58 46, 52 34 Z"
          fill={`url(#${gradId})`}
          opacity="0.75"
        />
      </svg>
    </Box>
  );
}

function iconFor(kind: EventData["schedule"][number]["kind"]) {
  if (kind === "church") return <ChurchRoundedIcon fontSize="small" />;
  if (kind === "party") return <LocalBarRoundedIcon fontSize="small" />;
  return <HomeRoundedIcon fontSize="small" />;
}

/** Lighter schedule row – no “product card” look */
function ScheduleCard({
  kind,
  title,
  time,
  place,
  address,
  accent,
}: {
  kind: EventData["schedule"][number]["kind"];
  title: string;
  time: string;
  place: string;
  address: string;
  accent?: boolean;
}) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        p: { xs: 1.25, sm: 1.5 },
        bgcolor: "transparent",
        border: "1px solid rgba(0,0,0,0.09)",
        boxShadow: "none",
        transition: "border-color 180ms ease",
        "&:hover": {
          borderColor: accent ? alpha(PALETTE.gold, 0.45) : alpha(PALETTE.rose, 0.30),
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 1.2,
          alignItems: "start",
          gridTemplateColumns: { xs: "1fr", sm: "42px 1fr" },
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "14px",
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(0,0,0,0.10)",
            color: accent ? PALETTE.gold : PALETTE.rose,
            justifySelf: { xs: "start", sm: "auto" },
          }}
        >
          {iconFor(kind)}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 900,
              letterSpacing: 0.15,
              color: PALETTE.ink,
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 0.75,
              flexWrap: "wrap",
              alignItems: "flex-start",
              "& > *": { maxWidth: "100%" },
            }}
          >
            <Chip
              size="small"
              icon={<AccessTimeRoundedIcon />}
              label={time}
              variant="outlined"
              sx={{
                bgcolor: "rgba(255,255,255,0.55)",
                borderColor: "rgba(0,0,0,0.10)",
                height: "auto",
                maxWidth: "100%",
                "& .MuiChip-label": {
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  py: 0.35,
                },
              }}
            />
            <Chip
              size="small"
              icon={<LocationOnRoundedIcon />}
              label={place}
              variant="outlined"
              sx={{
                bgcolor: "rgba(255,255,255,0.55)",
                borderColor: "rgba(0,0,0,0.10)",
                height: "auto",
                maxWidth: "100%",
                "& .MuiChip-label": {
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  py: 0.35,
                },
              }}
            />
          </Stack>

          <Typography
            sx={{
              mt: 0.9,
              color: "text.secondary",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {address}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function InviteClient({ slug, event }: { slug: string; event: EventData }) {
  return (
    <Box sx={{ position: "relative" }}>
      {/* subtle greenery outside */}
      <LeafCorner pos="tl" />
      <LeafCorner pos="tr" />
      <LeafCorner pos="bl" />
      <LeafCorner pos="br" />

      {/* moving vibe behind */}
      <WeddingVibe intensity={10} />

      {/* Frame controls overall page width + mobile padding */}
      <Frame density="medium">
        {/* Florals hugging the frame (front layer) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            // soften florals on small screens so text stays readable
            opacity: { xs: 0.72, sm: 0.9 },
          }}
        >
          <StaticFlorals density="medium" theme="bonbon" />
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            // ✅ wider overall card to give breathing room
            maxWidth: { xs: "100%", sm: 1120, md: 1320, lg: 1440 },
            mx: "auto",
            overflow: "hidden",
            position: "relative",
            zIndex: 3,
            borderRadius: { xs: 4, sm: 6 },
            bgcolor: PALETTE.glass,
            border: "1px solid rgba(0,0,0,0.06)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 38px 140px rgba(0,0,0,0.16)",
          }}
        >
          {/* inner hairline highlight */}
          <Box
            sx={{
              position: "absolute",
              inset: 1,
              borderRadius: 6,
              pointerEvents: "none",
              border: "1px solid rgba(255,255,255,0.62)",
              opacity: 0.55,
              zIndex: 1,
            }}
          />

          {/* premium top bar */}
          <Box
            sx={{
              height: 10,
              background: `linear-gradient(90deg, ${PALETTE.berry}, ${PALETTE.blush}, ${PALETTE.gold}, ${PALETTE.blush}, ${PALETTE.berry})`,
            }}
          />

          {/* background depth */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              background:
                `radial-gradient(900px 520px at 18% 8%, ${alpha(PALETTE.rose, 0.14)}, transparent 60%),` +
                `radial-gradient(900px 620px at 82% 90%, ${alpha(PALETTE.sage, 0.16)}, transparent 62%),` +
                `radial-gradient(700px 520px at 55% 40%, ${alpha(PALETTE.gold, 0.10)}, transparent 65%)`,
            }}
          />

          {/* ✅ rectangular gold frame (no hexagon) */}
          <Box
            sx={{
              position: "absolute",
              inset: { xs: 12, sm: 18 },
              zIndex: 2,
              pointerEvents: "none",
              borderRadius: { xs: 18, sm: 22 },
              border: "2px solid",
              borderColor: alpha(PALETTE.gold, 0.7),
              boxShadow: `0 22px 60px ${alpha(PALETTE.gold, 0.10)}`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: { xs: 16, sm: 24 },
              zIndex: 2,
              pointerEvents: "none",
              borderRadius: { xs: 16, sm: 20 },
              border: "1px solid rgba(255,255,255,0.55)",
              opacity: 0.8,
            }}
          />

          {/* subtle internal florals */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 1,
              opacity: { xs: 0.08, sm: 0.12 },
              mixBlendMode: "multiply",
              filter: "blur(0.5px)",
            }}
          >
            <StaticFlorals density="lush" theme="bonbon" />
          </Box>

          {/* vibe overlay */}
          <WeddingVibe intensity={14} mode="absolute" zIndex={10} opacity={0.9} clipRadius={24} />

          {/* CONTENT */}
          <Box
            sx={{
              position: "relative",
              zIndex: 20,
              // ✅ better mobile padding so top/bottom text is never cramped
              px: { xs: 2.2, sm: 5.5, md: 7 },
              pt: { xs: 3.2, sm: 4.6 },
              pb: { xs: 4.2, sm: 6.0 }, // ✅ extra bottom room
            }}
          >
            <Stack spacing={{ xs: 2.2, sm: 2.6 }} alignItems="center">
              <Chip
                icon={<VerifiedRoundedIcon />}
                label="Premium Digital Invite"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 0.4,
                  bgcolor: "rgba(255,255,255,0.62)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  backdropFilter: "blur(10px)",
                  maxWidth: "100%",
                  "& .MuiChip-label": { overflowWrap: "anywhere" },
                }}
                variant="outlined"
              />

              {/* Hero Title (mobile-friendly) */}
              <Stack spacing={0.6} alignItems="center" sx={{ textAlign: "center", px: { xs: 0.5, sm: 0 } }}>
                <Typography
                  sx={{
                    fontFamily: "cursive",
                    fontSize: { xs: 34, sm: 54, md: 58 },
                    lineHeight: 1.0,
                    letterSpacing: 0.35,
                    color: PALETTE.ink,
                  }}
                >
                  Wedding Invitation
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 850,
                    fontSize: { xs: 11, sm: 12 },
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    color: "rgba(0,0,0,0.55)",
                  }}
                >
                  {event.dateText}
                </Typography>
              </Stack>

              <Chip
                label={event.verse}
                variant="outlined"
                sx={{
                  bgcolor: "rgba(255,255,255,0.60)",
                  borderColor: "rgba(0,0,0,0.08)",
                  backdropFilter: "blur(10px)",
                  maxWidth: "100%",
                  "& .MuiChip-label": { whiteSpace: "normal", overflowWrap: "anywhere" },
                }}
              />

              <Typography
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  maxWidth: 780,
                  px: { xs: 0.5, sm: 0 },
                }}
              >
                {event.familiesLine}
              </Typography>

              {/* Names */}
              <Box sx={{ width: "100%", textAlign: "center", mt: 0.2 }}>
                <Typography
                  sx={{
                    fontFamily: "cursive",
                    fontSize: { xs: 34, sm: 62, md: 68 },
                    lineHeight: 1.02,
                    letterSpacing: 0.2,
                    color: PALETTE.ink,

                    // ✅ one line on sm+, safe wrap on xs
                    whiteSpace: { xs: "normal", sm: "nowrap" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                    px: { xs: 0.5, sm: 0 },
                  }}
                >
                  {event.coupleLeft}
                  <Box
                    component="span"
                    sx={{
                      mx: 1.1,
                      color: PALETTE.gold,
                      textShadow: `0 14px 36px ${alpha(PALETTE.gold, 0.25)}`,
                    }}
                  >
                    &
                  </Box>
                  {event.coupleRight}
                </Typography>

                <Stack
                  direction="row"
                  spacing={2.0}
                  justifyContent="center"
                  sx={{
                    mt: 1.0,
                    color: "rgba(0,0,0,0.55)",
                    flexWrap: "wrap",
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  <Typography sx={{ fontWeight: 950, letterSpacing: 1.0 }}>
                    {event.surnameLeft}
                  </Typography>
                  <Typography sx={{ fontWeight: 950, letterSpacing: 1.0 }}>
                    {event.surnameRight}
                  </Typography>
                </Stack>

                <Stack direction="column" spacing={1.1} alignItems="center" sx={{ mt: 2.0 }}>
                  <Countdown targetISO={event.dateISO} />
                  <RSVPCTA slug={slug} accessCode={event.accessCode} />
                </Stack>

                <Typography sx={{ mt: 1.0, color: "text.secondary", px: 1 }}>
                  Link: <strong>{slug}</strong>
                </Typography>
              </Box>

              <Divider flexItem sx={{ mt: 0.5, borderColor: "rgba(0,0,0,0.06)" }} />

              {/* Schedule */}
              <Box sx={{ width: "100%" }}>
                <Typography sx={{ fontWeight: 950, letterSpacing: 0.35, mb: 1.2, color: PALETTE.ink }}>
                  Schedule
                </Typography>

                <Stack spacing={1.1}>
                  {event.schedule.map((s) => (
                    <ScheduleCard
                      key={s.title}
                      kind={s.kind}
                      title={s.title}
                      time={s.time}
                      place={s.place}
                      address={s.address}
                      accent={s.accent}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider flexItem sx={{ borderColor: "rgba(0,0,0,0.06)" }} />

              <Typography
                sx={{
                  fontFamily: "cursive",
                  fontSize: { xs: 22, sm: 32 },
                  textAlign: "center",
                  color: alpha(PALETTE.ink, 0.86),
                  px: { xs: 1, sm: 0 },
                }}
              >
                {event.footerLine}
              </Typography>

              {/* Contacts (more bottom room + mobile-friendly wrap) */}
              <Box sx={{ width: "100%", mt: 1.2, pb: { xs: 3.2, sm: 4.2 } }}>
                <Typography
                  sx={{
                    fontWeight: 950,
                    letterSpacing: 0.35,
                    mb: 1.2,
                    color: PALETTE.ink,
                    textAlign: "center",
                  }}
                >
                  Contacts
                </Typography>

                <Stack
                  direction="row"
                  useFlexGap
                  flexWrap="wrap"
                  gap={1.2}
                  justifyContent="center"
                  sx={{ px: { xs: 0.2, sm: 0 } }}
                >
                  {event.contacts.map((c) => (
                    <Chip
                      key={c.phone}
                      icon={<CallRoundedIcon />}
                      label={`${c.name} • ${c.phone}`}
                      variant="outlined"
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        minWidth: { sm: 280 },
                        maxWidth: "100%",
                        justifyContent: "flex-start",
                        bgcolor: "rgba(255,255,255,0.62)",
                        borderColor: "rgba(0,0,0,0.08)",
                        backdropFilter: "blur(10px)",
                        py: 2.1,
                        "& .MuiChip-label": {
                          fontWeight: 800,
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Frame>
    </Box>
  );
}
