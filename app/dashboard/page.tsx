import type { Metadata } from "next";
import { Box, Typography, Chip } from "@mui/material";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <Box sx={{ p: 3, minHeight: "100dvh" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Selamat datang, {session?.user?.name} 👋
      </Typography>
      <Chip
        label="Fase 2 akan datang"
        sx={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
          fontWeight: 600,
        }}
      />
    </Box>
  );
}
