import React from "react";
import { Box, Container } from "@mui/material";
import InviteClient from "./InviteClient";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;

  // For now static demo event (later: fetch from Mongo by slug)
  const event = {
    verse: "(Itangiriro 2:24)",
    familiesLine:
      "Umuryango wa MATEGEKO Faustin n’uwa NSENGIYERA Jean wishimiye kubatumira…",
    coupleLeft: "Peruth N",
    coupleRight: "Innocent",
    surnameLeft: "NSENGIYERA",
    surnameRight: "NSENGIYUMVA",
    dateISO: "2026-04-20T14:00:00",
    dateText: "Buzaba tariki ya 04.20.2025",
    accessCode: "WED2025",
    footerLine: "Kwifatanya natwe bizadushimisha!",
    contacts: [
      { name: "N. PERUTH", phone: "+1 (315) 790-0161" },
      { name: "N. INNOCENT", phone: "+1 (602) 800-4366" },
    ],
    schedule: [
      {
        title: "Introduction & Dowry",
        time: "9:00 AM – 12:00 PM",
        place: "American Royal Palace",
        address: "1915 W Thunderbird Rd, Phoenix, AZ 85023",
        kind: "home" as const,
      },
      {
        title: "Religious Ceremony",
        time: "2:00 PM – 3:00 PM",
        place: "Mount Carmel Church",
        address: "6750 N 7th Ave, Phoenix, AZ 85013",
        kind: "church" as const,
        accent: true,
      },
      {
        title: "Reception",
        time: "4:00 PM – 11:30 PM",
        place: "American Royal Palace",
        address: "1915 W Thunderbird Rd, Phoenix, AZ 85023",
        kind: "party" as const,
      },
    ],
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        py: { xs: 3, sm: 7 },
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(1200px 900px at 15% 10%, rgba(216,180,112,0.18), transparent 58%)," +
          "radial-gradient(1000px 800px at 90% 90%, rgba(110,170,140,0.20), transparent 58%)," +
          "linear-gradient(180deg, #F7F3EE 0%, #F1EEEA 35%, #EFEAE4 100%)",
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative" }}>
        <InviteClient slug={slug} event={event} />
      </Container>
    </Box>
  );
}
