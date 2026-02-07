"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type PledgeForm = {
  name: string;
  amount: number;
  note: string;
  phone: string;
  currency: "USD";
};

export default function PledgeDialog({
  open,
  onClose,
  eventSlug,
}: {
  open: boolean;
  onClose: () => void;
  eventSlug: string;
}) {
  const [form, setForm] = useState<PledgeForm>({
    name: "",
    amount: 50,
    note: "",
    phone: "",
    currency: "USD",
  });

  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset when opened
  useEffect(() => {
    if (!open) return;
    setSaved(false);
    setApiError(null);
    setSubmitting(false);
    setForm({ name: "", amount: 50, note: "", phone: "", currency: "USD" });
  }, [open]);

  const canSubmit = useMemo(
    () => form.name.trim().length >= 2 && Number.isFinite(form.amount) && form.amount > 0,
    [form.name, form.amount]
  );

  const submit = async () => {
    if (!canSubmit || submitting) return;

    setApiError(null);
    setSaved(false);
    setSubmitting(true);

    const payload = {
      fullName: form.name.trim(),
      amount: Number(form.amount),
      currency: form.currency,
      phone: form.phone.trim() || undefined,
      note: form.note.trim() || undefined,
    };

    try {
      const res = await fetch(`/api/events/${eventSlug}/pledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setApiError(data?.error || "Failed to submit pledge. Please try again.");
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

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 900 }}>Pledge a Contribution</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {saved && <Alert severity="success">Pledge submitted. 💛</Alert>}
          {apiError && <Alert severity="error">{apiError}</Alert>}

          <Typography sx={{ color: "text.secondary" }}>
            Pledge now. Later we can add payment + balance tracking.
          </Typography>

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
            label="Pledge amount (USD)"
            type="number"
            value={form.amount}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                amount: Math.max(1, Number(e.target.value || 1)),
              }))
            }
            inputProps={{ min: 1, step: 1 }}
            fullWidth
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
              {submitting ? "Submitting..." : "Submit Pledge"}
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
