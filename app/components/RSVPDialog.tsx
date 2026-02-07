"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type RSVPForm = {
  name: string;
  attending: "yes" | "no";
  guests: number;
  note: string;
  phone: string;
};

export default function RSVPDialog({
  open,
  onClose,
  eventSlug,
}: {
  open: boolean;
  onClose: () => void;
  eventSlug: string;
}) {
  const [form, setForm] = useState<RSVPForm>({
    name: "",
    attending: "yes",
    guests: 1,
    note: "",
    phone: "",
  });

  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset when opened (clean UX)
  useEffect(() => {
    if (!open) return;
    setSaved(false);
    setApiError(null);
    setSubmitting(false);
    setForm({
      name: "",
      attending: "yes",
      guests: 1,
      note: "",
      phone: "",
    });
  }, [open]);

  const canSubmit = useMemo(() => form.name.trim().length >= 2, [form.name]);

  const submit = async () => {
    if (!canSubmit || submitting) return;

    setApiError(null);
    setSaved(false);
    setSubmitting(true);

    const payload = {
      fullName: form.name.trim(),
      status: form.attending === "yes" ? "ACCEPT" : "DECLINE",
      guests: form.attending === "no" ? 0 : Number(form.guests || 0),
      phone: form.phone.trim() || undefined,
      message: form.note.trim() || undefined,
    };

    try {
      const res = await fetch(`/api/events/${eventSlug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setApiError(data?.error || "Failed to submit RSVP. Please try again.");
        setSubmitting(false);
        return;
      }

      setSaved(true);
      setSubmitting(false);

      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 900);
    } catch {
      setApiError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  };

  const onGuestsChange = (v: string) => {
    // Allow empty while typing; clamp only when valid
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    setForm((p) => ({ ...p, guests: Math.max(1, Math.min(20, n)) }));
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 900 }}>RSVP</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {saved && <Alert severity="success">RSVP submitted. 🎉</Alert>}
          {apiError && <Alert severity="error">{apiError}</Alert>}

          <TextField
            label="Your full name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            fullWidth
            autoFocus
          />

          <TextField
            label="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Are you attending?"
            select
            value={form.attending}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                attending: e.target.value as "yes" | "no",
                guests: e.target.value === "no" ? 0 : Math.max(1, p.guests || 1),
              }))
            }
            fullWidth
          >
            <MenuItem value="yes">Yes, I will attend</MenuItem>
            <MenuItem value="no">No, I can't make it</MenuItem>
          </TextField>

          <TextField
            label="Number of guests"
            type="number"
            value={form.attending === "no" ? 0 : form.guests}
            onChange={(e) => onGuestsChange(e.target.value)}
            inputProps={{ min: 1, max: 20 }}
            fullWidth
            disabled={form.attending === "no"}
          />

          <TextField
            label="Note (optional)"
            value={form.note}
            onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            fullWidth
            multiline
            minRows={3}
          />

          <Divider />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              disabled={submitting}
              sx={{ borderRadius: 999, textTransform: "none" }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              disabled={!canSubmit || submitting}
              onClick={submit}
              sx={{ borderRadius: 999, textTransform: "none", boxShadow: "none" }}
            >
              {submitting ? "Submitting..." : "Submit RSVP"}
            </Button>
          </Stack>

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Saved to the event record.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
