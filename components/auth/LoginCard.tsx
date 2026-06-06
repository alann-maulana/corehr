"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const GOOGLE_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const IS_DEV = process.env.NEXT_PUBLIC_IS_DEV === "true";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError("Gagal masuk dengan Google. Silakan coba lagi.");
      setIsGoogleLoading(false);
    }
  };

  const handleMockLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      // Gunakan custom API route — bypass NextAuth Credentials CSRF flow
      const res = await fetch("/api/dev/mock-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Login berhasil — hard navigate agar session cookie terbaca
        window.location.href = "/";
      } else {
        setError(data.error ?? "Login gagal. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsPending(false);
    }
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
          "radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(139,92,246,0.1) 0%, transparent 50%), #0a0a14",
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-192x192.png"
          alt="CoreHR Logo"
          width={64}
          height={64}
          style={{ borderRadius: 16, marginBottom: 12 }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
          }}
        >
          CoreHR
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Sistem Informasi Manajemen HR
        </Typography>
      </Box>

      {/* Card */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          background: "rgba(15, 15, 26, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Selamat Datang
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Masuk ke akun Anda untuk melanjutkan
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Google Sign-In */}
          <Button
            id="btn-google-login"
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isPending}
            startIcon={!isGoogleLoading ? GOOGLE_ICON : undefined}
            sx={{
              borderColor: "rgba(99, 102, 241, 0.35)",
              color: "text.primary",
              py: 1.4,
              fontSize: "0.95rem",
              backgroundColor: "rgba(255,255,255,0.03)",
              "&:hover": {
                borderColor: "#6366f1",
                backgroundColor: "rgba(99,102,241,0.08)",
                boxShadow: "0 0 16px rgba(99,102,241,0.25)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isGoogleLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Masuk dengan Google"
            )}
          </Button>

          {/* Mock Login — Dev Only */}
          {IS_DEV && (
            <>
              <Box sx={{ position: "relative", my: 2.5 }}>
                <Divider>
                  <Chip
                    label="DEV MODE"
                    size="small"
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                      color: "#f59e0b",
                      border: "1px solid rgba(245,158,11,0.3)",
                    }}
                  />
                </Divider>
              </Box>

              <form onSubmit={handleMockLogin} noValidate>
                <TextField
                  id="mock-email"
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  sx={{ mb: 1.5 }}
                  autoComplete="email"
                  placeholder="admin@corehr.dev"
                />
                <TextField
                  id="mock-password"
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                  autoComplete="current-password"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword((s) => !s)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  id="btn-mock-login"
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isPending || isGoogleLoading}
                  sx={{ py: 1.4 }}
                >
                  {isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Masuk (Mock)"
                  )}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 3, opacity: 0.5 }}
      >
        CoreHR v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"} · Hak Cipta &copy;{" "}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
