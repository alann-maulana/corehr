"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { signOut } from "next-auth/react";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

const DRAWER_WIDTH = 260;

export default function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user.role === "admin";

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardRoundedIcon />,
    },
    {
      label: "Profil",
      path: "/dashboard/profile",
      icon: <PersonRoundedIcon />,
    },
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            path: "/dashboard/admin",
            icon: <AdminPanelSettingsRoundedIcon />,
          },
        ]
      : []),
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (mobileOpen) setMobileOpen(false);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Mendapatkan judul halaman saat ini berdasarkan path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Absensi";
    if (pathname === "/dashboard/profile") return "Profil Saya";
    if (pathname === "/dashboard/admin") return "Admin Panel";
    return "CoreHR";
  };

  // Render konten sidebar drawer
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "rgba(15, 15, 26, 0.95)",
        borderRight: "1px solid rgba(99, 102, 241, 0.12)",
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-192x192.png"
          alt="CoreHR Logo"
          width={36}
          height={36}
          style={{ borderRadius: 8 }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
          }}
        >
          CoreHR
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(99,102,241,0.12)" }} />

      {/* User Quick Info */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={user.image ?? undefined}
          alt={user.name ?? "User"}
          sx={{
            width: 44,
            height: 44,
            border: "2px solid rgba(99, 102, 241, 0.3)",
          }}
        >
          {user.name?.[0]}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
            {user.role === "admin" ? "Administrator" : "Karyawan"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(99,102,241,0.12)", mb: 2 }} />

      {/* Menu List */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? "rgba(99, 102, 241, 0.08)" : "transparent",
                  color: isActive ? "#a78bfa" : "text.primary",
                  border: isActive ? "1px solid rgba(99, 102, 241, 0.2)" : "1px solid transparent",
                  "& .MuiListItemIcon-root": {
                    color: isActive ? "#a78bfa" : "text.secondary",
                  },
                  "&:hover": {
                    backgroundColor: isActive ? "rgba(99, 102, 241, 0.12)" : "rgba(255,255,255,0.03)",
                    border: isActive ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(255,255,255,0.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.95rem",
                        fontWeight: isActive ? 600 : 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleLogout}
          startIcon={<LogoutRoundedIcon />}
          sx={{
            py: 1.2,
            borderRadius: 2,
            borderColor: "rgba(239, 68, 68, 0.2)",
            "&:hover": {
              borderColor: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
            },
          }}
        >
          Keluar
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(10, 10, 20, 0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.12)",
          boxShadow: "none",
          width: isMobile ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuRoundedIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 750, letterSpacing: "-0.5px" }}
          >
            {getPageTitle()}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {!isMobile && (
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {user.name}
              </Typography>
            )}
            <Avatar
              src={user.image ?? undefined}
              alt={user.name ?? "User"}
              onClick={() => handleNavigation("/dashboard/profile")}
              sx={{
                width: 36,
                height: 36,
                cursor: "pointer",
                border: "2px solid rgba(99, 102, 241, 0.2)",
                "&:hover": {
                  borderColor: "#6366f1",
                },
                transition: "border-color 0.2s ease",
              }}
            >
              {user.name?.[0]}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar Drawer */}
      {!isMobile && (
        <Box component="nav" sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}>
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                border: "none",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>
      )}

      {/* Mobile Drawer (Side Menu on Hamburger click) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: isMobile ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          pt: { xs: "80px", sm: "88px" },
          pb: isMobile ? "88px" : "24px",
          background: "#0a0a14",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.drawer + 2,
            background: "rgba(19, 19, 31, 0.85)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(99, 102, 241, 0.15)",
            borderRadius: 0,
          }}
          elevation={4}
        >
          <BottomNavigation
            value={pathname}
            onChange={(_, newValue) => handleNavigation(newValue)}
            sx={{
              background: "transparent",
              height: 64,
              "& .MuiBottomNavigationAction-root": {
                color: "text.secondary",
                minWidth: 0,
                padding: "8px 0",
              },
              "& .Mui-selected": {
                color: "#a78bfa !important",
                "& .MuiSvgIcon-root": {
                  transform: "scale(1.1)",
                  color: "#a78bfa",
                  filter: "drop-shadow(0 0 8px rgba(167, 139, 250, 0.5))",
                },
                transition: "all 0.2s ease",
              },
            }}
          >
            {navigationItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                value={item.path}
                icon={item.icon}
                sx={{
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  },
                  "&.Mui-selected .MuiBottomNavigationAction-label": {
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  },
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
