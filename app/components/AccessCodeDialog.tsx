"use client";

import { useMemo, useState } from "react";
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

export default function AccessCodeDialog({
  open,
  onClose,
  expectedCode,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  expectedCode: string;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const canSubmit = useMemo(() => code.trim().length >= 3, [code]);

  const submit = () => {
    const clean = code.trim().toLowerCase();
    const exp = expectedCode.trim().toLowerCase();
    if (clean !== exp) {
      setErr("Incorrect access code. Please try again.");
      return;
    }
    setErr("");
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 900 }}>Enter Access Code</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <Typography sx={{ color: "text.secondary" }}>
            This invitation is protected. Please enter the code shared by the couple.
          </Typography>

          {err && <Alert severity="error">{err}</Alert>}

          <TextField
            label="Access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            autoFocus
          />

          <Divider />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 999, textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              disabled={!canSubmit}
              onClick={submit}
              sx={{ borderRadius: 999, textTransform: "none", boxShadow: "none" }}
            >
              Continue
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
