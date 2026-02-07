import {
    Box,
    Chip,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
  } from "@mui/material";
  
  import { dbConnect } from "@/lib/mongodb";
  import RSVP from "@/models/RSVP";
  import Pledge from "@/models/Pledge";
  
  export const runtime = "nodejs";
  export const revalidate = 0;
  
  type Props = {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ key?: string }>;
  };
  
  function formatDate(d: any) {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "";
    }
  }
  
  export default async function AdminEventPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const sp = (await searchParams) ?? {};
    const key = sp.key ?? "";
  
    const ADMIN_KEY = process.env.ADMIN_KEY ?? "";
  
    if (!ADMIN_KEY || key !== ADMIN_KEY) {
      return (
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 22 }}>
              Admin Access Required
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Add <code>ADMIN_KEY</code> to <code>.env.local</code>, then open:
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(0,0,0,0.02)",
                  overflowX: "auto",
                }}
              >
                <code>
                  /admin/events/{slug}?key=YOUR_ADMIN_KEY
                </code>
              </Paper>
            </Box>
          </Paper>
        </Container>
      );
    }
  
    await dbConnect();
  
    const [rsvps, pledges] = await Promise.all([
      RSVP.find({ eventSlug: slug }).sort({ createdAt: -1 }).lean(),
      Pledge.find({ eventSlug: slug }).sort({ createdAt: -1 }).lean(),
    ]);
  
    const accepted = rsvps.filter((r: any) => r.status === "ACCEPT");
    const declined = rsvps.filter((r: any) => r.status === "DECLINE");
    const maybe = rsvps.filter((r: any) => r.status === "MAYBE");
  
    const totalGuests = accepted.reduce(
      (sum: number, r: any) => sum + (Number(r.guests) || 0),
      0
    );
  
    const totalPledged = pledges.reduce(
      (sum: number, p: any) => sum + (Number(p.amount) || 0),
      0
    );
  
    return (
      <Box sx={{ minHeight: "100dvh", bgcolor: "#F6F4F0", py: 5 }}>
        <Container maxWidth="lg">
          <Stack spacing={2.5}>
            <Box>
              <Typography sx={{ fontWeight: 950, fontSize: 28 }}>
                Admin Dashboard
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Event: <b>{slug}</b>
              </Typography>
            </Box>
  
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                alignItems={{ md: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`RSVPs: ${rsvps.length}`} />
                  <Chip label={`Accepted: ${accepted.length}`} color="success" />
                  <Chip label={`Declined: ${declined.length}`} color="error" />
                  <Chip label={`Maybe: ${maybe.length}`} color="warning" />
                  <Chip label={`Guests (accepted): ${totalGuests}`} />
                </Stack>
  
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`Pledges: ${pledges.length}`} />
                  <Chip label={`Total pledged: $${totalPledged}`} />
                </Stack>
              </Stack>
            </Paper>
  
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography sx={{ fontWeight: 900, mb: 1.5 }}>
                RSVPs
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Name</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                      <TableCell><b>Guests</b></TableCell>
                      <TableCell><b>Phone</b></TableCell>
                      <TableCell><b>Message</b></TableCell>
                      <TableCell><b>Created</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rsvps.map((r: any) => (
                      <TableRow key={String(r._id)}>
                        <TableCell>{r.fullName}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={r.status}
                            color={
                              r.status === "ACCEPT"
                                ? "success"
                                : r.status === "DECLINE"
                                ? "error"
                                : "warning"
                            }
                          />
                        </TableCell>
                        <TableCell>{r.guests ?? 0}</TableCell>
                        <TableCell>{r.phone ?? ""}</TableCell>
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={r.message ?? ""}
                          >
                            {r.message ?? ""}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(r.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                    {rsvps.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography sx={{ color: "text.secondary" }}>
                            No RSVPs yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
  
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography sx={{ fontWeight: 900, mb: 1.5 }}>
                Pledges
              </Typography>
  
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Name</b></TableCell>
                      <TableCell><b>Amount</b></TableCell>
                      <TableCell><b>Currency</b></TableCell>
                      <TableCell><b>Phone</b></TableCell>
                      <TableCell><b>Note</b></TableCell>
                      <TableCell><b>Created</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pledges.map((p: any) => (
                      <TableRow key={String(p._id)}>
                        <TableCell>{p.fullName}</TableCell>
                        <TableCell>${p.amount}</TableCell>
                        <TableCell>{p.currency ?? "USD"}</TableCell>
                        <TableCell>{p.phone ?? ""}</TableCell>
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={p.note ?? ""}
                          >
                            {p.note ?? ""}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(p.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                    {pledges.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography sx={{ color: "text.secondary" }}>
                            No pledges yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
  
              <Divider sx={{ my: 2 }} />
  
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Tip: later we’ll add CSV export + payment reconciliation.
              </Typography>
            </Paper>
          </Stack>
        </Container>
      </Box>
    );
  }
  