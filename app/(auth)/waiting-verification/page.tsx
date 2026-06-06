"use client";

import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";

export default function WaitingVerificationPage() {
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          "radial-gradient(ellipse at 30% 40%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(99,102,241,0.08) 0%, transparent 50%), #0a0a14",
      }}
    >
      {/* Brand */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-192x192.png"
          alt="CoreHR Logo"
          width={48}
          height={48}
          style={{ borderRadius: 12, marginBottom: 8 }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          CoreHR
        </Typography>
      </Box>

      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(15, 15, 26, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          borderRadius: 3,
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 70%)",
                border: "2px solid rgba(245,158,11,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "pulse 2.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": {
                    boxShadow: "0 0 0 0 rgba(245,158,11,0.3)",
                  },
                  "50%": {
                    boxShadow: "0 0 0 12px rgba(245,158,11,0)",
                  },
                },
              }}
            >
              <HourglassEmptyRoundedIcon
                sx={{
                  fontSize: 36,
                  color: "#f59e0b",
                  animation: "hourglassSpin 3s ease-in-out infinite",
                  "@keyframes hourglassSpin": {
                    "0%": { transform: "rotate(0deg)" },
                    "45%": { transform: "rotate(0deg)" },
                    "55%": { transform: "rotate(180deg)" },
                    "100%": { transform: "rotate(180deg)" },
                  },
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 700, textAlign: "center" }}
          >
            Menunggu Verifikasi
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2.5, lineHeight: 1.7, textAlign: "center" }}
          >
            Akun Anda sedang menunggu verifikasi dari Admin. Anda akan mendapat
            akses penuh setelah admin mengaktifkan akun Anda.
          </Typography>

          {/* User info */}
          {session?.user && (
            <>
              <Divider sx={{ mb: 2.5, borderColor: "rgba(99,102,241,0.15)" }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(99,102,241,0.12)",
                  mb: 2,
                }}
              >
                <Avatar
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? "User"}
                  sx={{ width: 40, height: 40 }}
                >
                  {session.user.name?.[0]}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontWeight: 600 }}
                >
                  {session.user.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: "block" }}
                >
                    {session.user.email}
                  </Typography>
                </Box>
                <Chip
                  label="Belum Diverifikasi"
                  size="small"
                  sx={{
                    fontSize: "0.65rem",
                    backgroundColor: "rgba(245,158,11,0.15)",
                    color: "#f59e0b",
                    border: "1px solid rgba(245,158,11,0.3)",
                  }}
                />
              </Box>
            </>
          )}

          {/* Info box */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              mb: 2.5,
            }}
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 18, color: "#6366f1", flexShrink: 0, mt: 0.1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Silakan hubungi administrator atau supervisor Anda untuk mempercepat
              proses verifikasi akun.
            </Typography>
          </Box>

          {/* Logout button */}
          <Button
            id="btn-logout-waiting"
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            disabled={isLoggingOut}
            startIcon={
              isLoggingOut ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <LogoutRoundedIcon />
              )
            }
            sx={{
              borderColor: "rgba(239,68,68,0.35)",
              color: "#ef4444",
              "&:hover": {
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.08)",
              },
            }}
          >
            {isLoggingOut ? "Keluar..." : "Keluar dari Akun"}
          </Button>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 3, opacity: 0.4 }}
      >
        CoreHR v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
      </Typography>
    </Box>
  );
}
