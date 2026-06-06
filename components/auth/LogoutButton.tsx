"use client";

import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="error"
      onClick={handleLogout}
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LogoutRoundedIcon />}
      sx={{
        py: 1.5,
        borderRadius: 2,
        fontWeight: 600,
        backgroundColor: "rgba(239, 68, 68, 0.85)",
        "&:hover": {
          backgroundColor: "#ef4444",
          boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)",
        },
        transition: "all 0.2s ease",
      }}
    >
      {isLoading ? "Keluar..." : "Keluar dari Akun"}
    </Button>
  );
}
