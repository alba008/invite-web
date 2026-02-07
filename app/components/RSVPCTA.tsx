"use client";

import { useState } from "react";
import { Button, Stack } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";

import RSVPDialog from "./RSVPDialog";
import PledgeDialog from "./PledgeDialog";
import AccessCodeDialog from "./AccessCodeDialog";
import { useEventAccess } from "./useEventAccess";

export default function RSVPCTA({
  slug,
  accessCode,
}: {
  slug: string;
  accessCode: string;
}) {
  const access = useEventAccess(slug);

  const [want, setWant] = useState<"rsvp" | "pledge" | null>(null);
  const [gateOpen, setGateOpen] = useState(false);

  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [pledgeOpen, setPledgeOpen] = useState(false);

  const openProtected = (which: "rsvp" | "pledge") => {
    if (access.hasAccess()) {
      which === "rsvp" ? setRsvpOpen(true) : setPledgeOpen(true);
      return;
    }
    setWant(which);
    setGateOpen(true);
  };

  const onGateSuccess = () => {
    access.grant();
    if (want === "rsvp") setRsvpOpen(true);
    if (want === "pledge") setPledgeOpen(true);
    setWant(null);
  };

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ width: "100%" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<FavoriteRoundedIcon />}
          onClick={() => openProtected("rsvp")}
          sx={{ borderRadius: 999, textTransform: "none", boxShadow: "none" }}
        >
          RSVP
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<RedeemRoundedIcon />}
          onClick={() => openProtected("pledge")}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          Pledge
        </Button>
      </Stack>

      <AccessCodeDialog
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        expectedCode={accessCode}
        onSuccess={onGateSuccess}
      />

      <RSVPDialog open={rsvpOpen} onClose={() => setRsvpOpen(false)} eventSlug={slug} />
      <PledgeDialog open={pledgeOpen} onClose={() => setPledgeOpen(false)} eventSlug={slug} />
    </>
  );
}
