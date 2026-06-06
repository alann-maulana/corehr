"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    background: {
      default: "#0a0a14",
      paper: "#13131f",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
    divider: "rgba(99, 102, 241, 0.15)",
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#22c55e",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#38bdf8",
    },
  },
  typography: {
    fontFamily: [roboto.style.fontFamily, "sans-serif"].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 60%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "#6366f1 #13131f",
        },
        "*::-webkit-scrollbar": {
          width: "6px",
        },
        "*::-webkit-scrollbar-track": {
          background: "#13131f",
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#6366f1",
          borderRadius: "3px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 0 20px rgba(99,102,241,0.4)",
          },
          "&.MuiButton-containedPrimary": {
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            "&:hover": {
              background: "linear-gradient(135deg, #818cf8, #a78bfa)",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(19, 19, 31, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(99, 102, 241, 0.15)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.03)",
            "& fieldset": {
              borderColor: "rgba(99, 102, 241, 0.25)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(99, 102, 241, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6366f1",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
