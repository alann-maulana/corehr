"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface UserItem {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "admin" | "employee";
  status: "verified" | "unverified";
  created_at: string;
}

interface HolidayItem {
  id: number;
  holiday_date: string;
  description: string;
}

interface AdminPanelProps {
  initialUsers: UserItem[];
  initialHolidays: HolidayItem[];
  currentUserId: string;
}

export default function AdminPanel({ initialUsers, initialHolidays, currentUserId }: AdminPanelProps) {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  
  // Users States
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersLoadingId, setUsersLoadingId] = useState<number | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Holidays States
  const [holidays, setHolidays] = useState<HolidayItem[]>(initialHolidays);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayDesc, setHolidayDesc] = useState("");
  const [holidaysLoading, setHolidaysLoading] = useState(false);
  const [holidaysError, setHolidaysError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<number | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // User Actions: Verify/Unverify user or Toggle Role
  const handleUpdateUser = async (userId: number, role?: "admin" | "employee", status?: "verified" | "unverified") => {
    setUsersLoadingId(userId);
    setUsersError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, status }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((u) => {
            if (u.id === userId) {
              return {
                ...u,
                ...(role ? { role } : {}),
                ...(status ? { status } : {}),
              };
            }
            return u;
          })
        );
        router.refresh();
      } else {
        setUsersError(data.error ?? "Gagal memperbarui pengguna.");
      }
    } catch {
      setUsersError("Terjadi kesalahan jaringan.");
    } finally {
      setUsersLoadingId(null);
    }
  };

  // Holiday Actions: Add Holiday
  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayDate || !holidayDesc.trim()) {
      setHolidaysError("Tanggal dan Keterangan wajib diisi");
      return;
    }

    setHolidaysLoading(true);
    setHolidaysError(null);

    try {
      const res = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holiday_date: holidayDate, description: holidayDesc }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Add to local state and sort
        const newHoliday = data.holiday;
        setHolidays((prev) => [...prev, newHoliday].sort((a, b) => a.holiday_date.localeCompare(b.holiday_date)));
        setHolidayDate("");
        setHolidayDesc("");
        router.refresh();
      } else {
        setHolidaysError(data.error ?? "Gagal menambahkan hari libur.");
      }
    } catch {
      setHolidaysError("Terjadi kesalahan jaringan.");
    } finally {
      setHolidaysLoading(false);
    }
  };

  // Holiday Actions: Delete Holiday dialog trigger
  const triggerDeleteHoliday = (id: number) => {
    setHolidayToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete holiday
  const handleConfirmDeleteHoliday = async () => {
    if (holidayToDelete === null) return;
    
    setHolidaysLoading(true);
    setHolidaysError(null);
    setDeleteDialogOpen(false);

    try {
      const res = await fetch(`/api/admin/holidays/${holidayToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Remove from local state
        setHolidays((prev) => prev.filter((h) => h.id !== holidayToDelete));
        router.refresh();
      } else {
        setHolidaysError(data.error ?? "Gagal menghapus hari libur.");
      }
    } catch {
      setHolidaysError("Terjadi kesalahan jaringan.");
    } finally {
      setHolidayToDelete(null);
      setHolidaysLoading(false);
    }
  };

  // Filtered users for search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Tab Nav Bar */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderBottom: "1px solid rgba(99, 102, 241, 0.15)",
          mb: 3,
          "& .MuiTabs-indicator": {
            backgroundColor: "#8b5cf6",
          },
          "& .MuiTab-root": {
            fontWeight: 700,
            color: "text.secondary",
            "&.Mui-selected": {
              color: "#a78bfa",
            },
          },
        }}
      >
        <Tab icon={<SupervisorAccountRoundedIcon />} label="Manajemen User" />
        <Tab icon={<CalendarTodayRoundedIcon />} label="Hari Libur" />
      </Tabs>

      {/* Tab 1: Manajemen User */}
      {tabValue === 0 && (
        <Card sx={{ background: "rgba(19, 19, 31, 0.6)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Verifikasi & Manajemen Akses
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Setujui pengguna baru agar dapat melakukan absensi atau ubah hak akses peran mereka.
            </Typography>

            {usersError && (
              <Alert severity="error" onClose={() => setUsersError(null)} sx={{ mb: 2, borderRadius: 2 }}>
                {usersError}
              </Alert>
            )}

            {/* Search Input */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Cari user berdasarkan nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <SearchRoundedIcon sx={{ color: "text.secondary", mr: 1 }} />,
                  },
                }}
                size="small"
              />
            </Box>

            {/* Users Table */}
            <TableContainer component={Paper} sx={{ backgroundColor: "transparent", backgroundImage: "none", boxShadow: "none" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { borderBottom: "1px solid rgba(99,102,241,0.15)", color: "text.secondary", fontWeight: 600, py: 1.2 } }}>
                    <TableCell>Pengguna</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        Tidak ada pengguna ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((row) => {
                      const isSelf = String(row.id) === currentUserId;
                      const isLoading = usersLoadingId === row.id;

                      return (
                        <TableRow
                          key={row.id}
                          sx={{
                            "& td": { borderBottom: "1px solid rgba(99,102,241,0.08)", py: 1.5 },
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.01)" },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar src={row.avatar_url ?? undefined} sx={{ width: 36, height: 36 }}>
                                {row.name[0]}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {row.name} {isSelf && "(Anda)"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                                  {row.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.role === "admin" ? "Admin" : "Employee"}
                              size="small"
                              color={row.role === "admin" ? "secondary" : "default"}
                              variant="outlined"
                              sx={{ fontWeight: 600, height: 22 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.status === "verified" ? "Verified" : "Unverified"}
                              size="small"
                              color={row.status === "verified" ? "success" : "warning"}
                              sx={{ fontWeight: 700, fontSize: "0.65rem", height: 22 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                              {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                <>
                                  {/* Verification Action */}
                                  {row.status === "unverified" ? (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="success"
                                      onClick={() => handleUpdateUser(row.id, undefined, "verified")}
                                      disabled={isSelf}
                                      sx={{ fontSize: "0.75rem", py: 0.5, px: 1.5, borderRadius: 1.5 }}
                                    >
                                      Verifikasi
                                    </Button>
                                  ) : (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="warning"
                                      onClick={() => handleUpdateUser(row.id, undefined, "unverified")}
                                      disabled={isSelf}
                                      sx={{ fontSize: "0.75rem", py: 0.5, px: 1.5, borderRadius: 1.5 }}
                                    >
                                      Batal Verif
                                    </Button>
                                  )}

                                  {/* Role Action */}
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() =>
                                      handleUpdateUser(row.id, row.role === "admin" ? "employee" : "admin", undefined)
                                    }
                                    disabled={isSelf}
                                    startIcon={<ShieldRoundedIcon sx={{ fontSize: "14px !important" }} />}
                                    sx={{ fontSize: "0.75rem", py: 0.5, px: 1.5, borderRadius: 1.5 }}
                                  >
                                    Ubah Peran
                                  </Button>
                                </>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Manajemen Hari Libur */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Add Holiday Form */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ background: "rgba(19, 19, 31, 0.6)" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Tambah Hari Libur Nasional
                </Typography>
                
                {holidaysError && (
                  <Alert severity="error" onClose={() => setHolidaysError(null)} sx={{ mb: 2, borderRadius: 2 }}>
                    {holidaysError}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleAddHoliday} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    id="holiday-date-picker"
                    type="date"
                    label="Tanggal Libur"
                    value={holidayDate}
                    onChange={(e) => setHolidayDate(e.target.value)}
                    disabled={holidaysLoading}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    required
                  />
                  <TextField
                    id="holiday-description"
                    label="Keterangan"
                    placeholder="Contoh: Hari Raya Idul Fitri"
                    value={holidayDesc}
                    onChange={(e) => setHolidayDesc(e.target.value)}
                    disabled={holidaysLoading}
                    required
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <Button
                    id="btn-add-holiday"
                    type="submit"
                    variant="contained"
                    disabled={holidaysLoading}
                    startIcon={holidaysLoading ? <CircularProgress size={16} color="inherit" /> : <AddRoundedIcon />}
                    sx={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      py: 1.2,
                    }}
                  >
                    Tambah Libur
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Holidays List */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ background: "rgba(19, 19, 31, 0.6)" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Daftar Hari Libur Terdaftar
                </Typography>

                <TableContainer component={Paper} sx={{ backgroundColor: "transparent", backgroundImage: "none", boxShadow: "none" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ "& th": { borderBottom: "1px solid rgba(99,102,241,0.15)", color: "text.secondary", fontWeight: 600, py: 1.2 } }}>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>Keterangan</TableCell>
                        <TableCell align="right">Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {holidays.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ py: 6, color: "text.secondary" }}>
                            Belum ada hari libur nasional yang ditambahkan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        holidays.map((row) => {
                          const d = new Date(row.holiday_date);
                          const dateText = d.toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          });

                          return (
                            <TableRow
                              key={row.id}
                              sx={{
                                "& td": { borderBottom: "1px solid rgba(99,102,241,0.08)", py: 1.5 },
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.01)" },
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {dateText}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{row.description}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => triggerDeleteHoliday(row.id)}
                                  disabled={holidaysLoading}
                                >
                                  <DeleteRoundedIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
        <DialogTitle sx={{ fontWeight: 700 }}>Hapus Hari Libur?</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            Apakah Anda yakin ingin menghapus hari libur nasional ini? Penghapusan ini akan mengembalikan perhitungan
            hari kerja efektif karyawan pada tanggal tersebut.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Batal
          </Button>
          <Button onClick={handleConfirmDeleteHoliday} variant="contained" color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
