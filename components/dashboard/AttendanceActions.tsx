"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

interface AttendanceActionsProps {
  todayAttendance: {
    id: number;
    date: string;
    check_in: string | null;
    check_out: string | null;
    check_in_photo: string | null;
    check_out_photo: string | null;
    check_in_notes: string | null;
    check_out_notes: string | null;
  } | null;
}

export default function AttendanceActions({ todayAttendance }: AttendanceActionsProps) {
  const router = useRouter();
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"in" | "out">("in");
  const [notes, setNotes] = useState("");
  
  // Simulated Camera States
  const [cameraActive, setCameraActive] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("id-ID", { hour12: false }));
      setDateStr(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpen = (actionType: "in" | "out") => {
    setType(actionType);
    setNotes("");
    setPhotoCaptured(false);
    setCameraActive(false);
    setError(null);
    setOpen(true);
    
    // Start simulated camera loading
    setIsCapturing(true);
    setTimeout(() => {
      setCameraActive(true);
      setIsCapturing(false);
    }, 1200);
  };

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleCapture = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);
    setPhotoCaptured(true);
  };

  const handleRetake = () => {
    setPhotoCaptured(false);
    setIsCapturing(true);
    setCameraActive(false);
    setTimeout(() => {
      setCameraActive(true);
      setIsCapturing(false);
    }, 800);
  };

  const handleSubmit = async () => {
    if (!photoCaptured) {
      setError("Anda wajib mengambil foto selfie terlebih dahulu");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, notes }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(data.error ?? "Gagal mencatatkan absensi.");
      }
    } catch {
      setError("Kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsPending(false);
    }
  };

  // Status helper
  const getStatusText = () => {
    if (!todayAttendance) {
      return {
        text: "Anda belum absen masuk hari ini",
        desc: "Silakan tekan tombol Absen Masuk untuk mencatatkan kehadiran.",
        color: "warning.main",
      };
    }
    if (todayAttendance.check_in && !todayAttendance.check_out) {
      return {
        text: `Sudah Absen Masuk pukul ${todayAttendance.check_in.substring(0, 5)}`,
        desc: "Jangan lupa untuk melakukan Absen Pulang sebelum meninggalkan kantor.",
        color: "success.main",
      };
    }
    return {
      text: `Absensi Hari Ini Selesai (${todayAttendance.check_in?.substring(0, 5)} - ${todayAttendance.check_out?.substring(0, 5)})`,
      desc: "Kerja bagus! Absensi Anda hari ini telah lengkap.",
      color: "info.main",
    };
  };

  const status = getStatusText();
  const hasCheckedIn = !!todayAttendance;
  const hasCheckedOut = !!todayAttendance?.check_out;

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        borderRadius: 3,
        mb: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 2.5,
          }}
        >
          {/* Clock & Status */}
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: "monospace", letterSpacing: "1px" }}>
              {time || "00:00:00"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5, mb: 2 }}>
              {dateStr}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: { xs: "center", sm: "flex-start" } }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: status.color,
                  boxShadow: `0 0 10px ${status.color}`,
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {status.text}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              {status.desc}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: { xs: "100%", sm: "auto" },
              flexDirection: { xs: "row", sm: "column" },
              alignSelf: { xs: "stretch", sm: "center" },
            }}
          >
            <Button
              id="btn-absen-masuk"
              fullWidth
              variant="contained"
              disabled={hasCheckedIn}
              onClick={() => handleOpen("in")}
              startIcon={<LoginRoundedIcon />}
              sx={{
                py: 1.4,
                px: 3,
                background: hasCheckedIn
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, #22c55e, #16a34a)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4ade80, #22c55e)",
                },
                boxShadow: hasCheckedIn ? "none" : "0 0 15px rgba(34,197,94,0.3)",
              }}
            >
              Absen Masuk
            </Button>
            <Button
              id="btn-absen-pulang"
              fullWidth
              variant="contained"
              disabled={!hasCheckedIn || hasCheckedOut}
              onClick={() => handleOpen("out")}
              startIcon={<LogoutRoundedIcon />}
              sx={{
                py: 1.4,
                px: 3,
                background: !hasCheckedIn || hasCheckedOut
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, #f59e0b, #d97706)",
                "&:hover": {
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                },
                boxShadow: !hasCheckedIn || hasCheckedOut ? "none" : "0 0 15px rgba(245,158,11,0.3)",
              }}
            >
              Absen Pulang
            </Button>
          </Box>
        </Box>
      </CardContent>

      {/* Simulated Camera Dialog Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              background: "rgba(19, 19, 31, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Absen {type === "in" ? "Masuk" : "Pulang"} - Kamera Selfie
          </Typography>
          <IconButton onClick={handleClose} disabled={isPending} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(99,102,241,0.12)", pb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Camera View Area */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/3",
              borderRadius: 2,
              backgroundColor: "#000",
              border: "1px solid rgba(99,102,241,0.25)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
            }}
          >
            {/* Flash Effect */}
            {showFlash && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#fff",
                  zIndex: 10,
                }}
              />
            )}

            {isCapturing && (
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress color="primary" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Menghubungkan ke kamera perangkat...
                </Typography>
              </Box>
            )}

            {cameraActive && !photoCaptured && (
              <>
                {/* Simulated Webcam Feed */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 80%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Styled avatar simulating webcam preview */}
                  <Avatar
                    sx={{
                      width: 140,
                      height: 140,
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      border: "2px dashed #6366f1",
                      animation: "pulse 2s infinite ease-in-out",
                      "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                      },
                    }}
                  >
                    <CameraAltRoundedIcon sx={{ fontSize: 48, color: "#6366f1" }} />
                  </Avatar>
                </Box>

                {/* Simulated Face Outline Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "60%",
                    height: "70%",
                    borderRadius: "50% 50% 45% 45%",
                    border: "2px dashed rgba(22, 163, 74, 0.6)",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                  }}
                />

                {/* Live Banner */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: "rgba(239, 68, 68, 0.8)",
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#fff", animation: "blink 1s infinite" }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#fff" }}>
                    SIMULATED LIVE
                  </Typography>
                </Box>

                {/* Capture Action Button overlay */}
                <Box sx={{ position: "absolute", bottom: 16 }}>
                  <Button
                    variant="contained"
                    onClick={handleCapture}
                    startIcon={<CameraAltRoundedIcon />}
                    sx={{
                      backgroundColor: "#ef4444",
                      "&:hover": { backgroundColor: "#dc2626" },
                      borderRadius: 10,
                      py: 1,
                      px: 2.5,
                      boxShadow: "0 4px 15px rgba(239,68,68,0.4)",
                    }}
                  >
                    Ambil Foto
                  </Button>
                </Box>
              </>
            )}

            {photoCaptured && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Simulated taken photo */}
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Captured Selfie"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                
                {/* Success Indicator overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 54, color: "#22c55e" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#fff" }}>
                    Foto Selfie Berhasil Diambil
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleRetake}
                    sx={{
                      color: "#fff",
                      borderColor: "#fff",
                      mt: 1,
                      "&:hover": { borderColor: "#a78bfa", color: "#a78bfa", backgroundColor: "rgba(255,255,255,0.08)" },
                    }}
                  >
                    Ulangi Foto
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Notes field */}
          <TextField
            id="attendance-notes"
            fullWidth
            label="Catatan Kehadiran (Opsional)"
            placeholder="Tulis alasan jika terlambat atau keterangan tambahan..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            disabled={isPending}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button onClick={handleClose} disabled={isPending} color="inherit">
            Batal
          </Button>
          <Button
            id="btn-submit-attendance"
            onClick={handleSubmit}
            variant="contained"
            disabled={isPending || !photoCaptured}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <CheckCircleRoundedIcon />}
            sx={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              "&:hover": { background: "linear-gradient(135deg, #818cf8, #a78bfa)" },
            }}
          >
            Kirim Absensi
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
