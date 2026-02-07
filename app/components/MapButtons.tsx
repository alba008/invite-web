"use client";

import { Button, Stack } from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

function makeGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function makeAppleMapsUrl(address: string) {
  return `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
}

export default function MapButtons({
  address,
  label = "Open location",
}: {
  address: string;
  label?: string;
}) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
      <Button
        fullWidth
        variant="contained"
        startIcon={<LocationOnRoundedIcon />}
        onClick={() => window.open(makeGoogleMapsUrl(address), "_blank")}
        sx={{
          borderRadius: 999,
          textTransform: "none",
          boxShadow: "none",
        }}
      >
        {label} (Google)
      </Button>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<LocationOnRoundedIcon />}
        onClick={() => window.open(makeAppleMapsUrl(address), "_blank")}
        sx={{ borderRadius: 999, textTransform: "none" }}
      >
        {label} (Apple)
      </Button>
    </Stack>
  );
}
