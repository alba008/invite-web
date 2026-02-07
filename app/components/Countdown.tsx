"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ targetISO }: { targetISO: string }) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [label, setLabel] = useState<string>("…");

  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setLabel("Today is the day 🎉");
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      setLabel(`${days}d ${pad(hours)}h ${pad(mins)}m`);
    };

    tick();
    const id = window.setInterval(tick, 5000); // smoother than 15s
    return () => window.clearInterval(id);
  }, [target]);

  return (
    <Chip
      icon={<AccessTimeRoundedIcon />}
      label={`Countdown: ${label}`}
      variant="outlined"
      sx={{
        bgcolor: "rgba(255,255,255,0.58)",
        backdropFilter: "blur(8px)",
        borderColor: "rgba(0,0,0,0.08)",
      }}
    />
  );
}
