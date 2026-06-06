import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import LogoutButton from "@/components/auth/LogoutButton";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Informasi profil dan akun pengguna CoreHR",
};

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "CoreHR";

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: { xs: 1, sm: 3 } }}>
      <Card
        sx={{
          background: "rgba(19, 19, 31, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(99, 102, 241, 0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Profile Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              mb: 4,
            }}
          >
            <Avatar
              src={user.image ?? undefined}
              alt={user.name ?? "User"}
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                border: "3px solid #6366f1",
                boxShadow: "0 0 24px rgba(99,102,241,0.35)",
              }}
            >
              {user.name?.[0]}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user.email}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={user.role === "admin" ? "Admin" : "Karyawan"}
                color={user.role === "admin" ? "secondary" : "primary"}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label="Terverifikasi"
                color="success"
                size="small"
                icon={<VerifiedRoundedIcon sx={{ fontSize: "16px !important" }} />}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Details List */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.light", mb: 1.5 }}>
            INFORMASI AKUN
          </Typography>
          <List disablePadding sx={{ mb: 4 }}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonRoundedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Nama Lengkap"
                secondary={user.name}
                slotProps={{
                  primary: { sx: { fontSize: "0.85rem", color: "text.secondary" } },
                  secondary: { sx: { fontSize: "1rem", color: "text.primary", fontWeight: 500 } },
                }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailRoundedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Alamat Email"
                secondary={user.email}
                slotProps={{
                  primary: { sx: { fontSize: "0.85rem", color: "text.secondary" } },
                  secondary: { sx: { fontSize: "1rem", color: "text.primary", fontWeight: 500 } },
                }}
              />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SecurityRoundedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Role / Hak Akses"
                secondary={user.role === "admin" ? "Administrator" : "Karyawan / Staff"}
                slotProps={{
                  primary: { sx: { fontSize: "0.85rem", color: "text.secondary" } },
                  secondary: { sx: { fontSize: "1rem", color: "text.primary", fontWeight: 500 } },
                }}
              />
            </ListItem>
          </List>

          <Divider sx={{ mb: 3 }} />

          {/* System Info */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.light", mb: 1.5 }}>
            APLIKASI
          </Typography>
          <List disablePadding sx={{ mb: 4 }}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <InfoRoundedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Versi Aplikasi"
                secondary={`${appName} v${appVersion}`}
                slotProps={{
                  primary: { sx: { fontSize: "0.85rem", color: "text.secondary" } },
                  secondary: { sx: { fontSize: "1rem", color: "text.primary", fontWeight: 500 } },
                }}
              />
            </ListItem>
          </List>

          {/* Logout Action */}
          <Box sx={{ mt: 2 }}>
            <LogoutButton />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
