import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
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
  Tooltip,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
  getWorkingDaysUpToToday,
  calculateWorkingHours,
  formatWorkingHours,
  getIndonesianMonthName,
  formatDbDate,
} from "@/lib/date-utils";
import AttendanceActions from "@/components/dashboard/AttendanceActions";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface DashboardPageProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  // Next.js 16 searchParams is a Promise
  const resolvedParams = await searchParams;
  
  const now = new Date();
  const year = resolvedParams.year ? parseInt(resolvedParams.year) : now.getFullYear();
  const month = resolvedParams.month ? parseInt(resolvedParams.month) : now.getMonth() + 1; // 1-indexed

  // Format month to 2 digits for database queries
  const monthStr = String(month).padStart(2, "0");
  const yearMonthStr = `${year}-${monthStr}`;

  // Get local date string for today YYYY-MM-DD
  const todayStr = now.toLocaleDateString("sv-SE");

  // Fetch data from MySQL database
  // 1. National holidays for the current month
  const dbHolidays = await db("holidays")
    .whereRaw("DATE_FORMAT(holiday_date, '%Y-%m') = ?", [yearMonthStr])
    .select("holiday_date", "description");

  const holidayDates = dbHolidays.map((h) => formatDbDate(h.holiday_date));

  // 2. User's attendance records for the selected month
  const dbAttendances = await db("attendances")
    .where({ user_id: user.id })
    .whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [yearMonthStr])
    .select("*");

  const attendanceMap = new Map(dbAttendances.map((a) => [formatDbDate(a.date), a]));

  // 3. User's today attendance status
  const todayAttendance = await db("attendances")
    .where({ user_id: user.id, date: todayStr })
    .first();

  // 4. Last 5 attendance records (all-time history, not just selected month)
  const lastFiveAttendances = await db("attendances")
    .where({ user_id: user.id })
    .orderBy("date", "desc")
    .limit(5)
    .select("*");

  // Calculate statistics
  // Get list of working days from start of month up to today (or end of month)
  const workingDaysUpToToday = getWorkingDaysUpToToday(year, month, holidayDates);
  
  // Attended days: attendance records in this month
  const totalHariMasuk = dbAttendances.filter((a) => a.check_in !== null).length;
  
  // Total working hours
  let totalWorkingHours = 0;
  dbAttendances.forEach((a) => {
    totalWorkingHours += calculateWorkingHours(a.check_in, a.check_out);
  });

  // Calculate mangkir/alpa (missed working days up to today)
  const mangkirDays: string[] = [];
  workingDaysUpToToday.forEach((dateStr) => {
    // If there is no attendance record for this working day, it is a missed day
    if (!attendanceMap.has(dateStr)) {
      mangkirDays.push(dateStr);
    }
  });

  const totalMangkir = mangkirDays.length;
  const totalHariLibur = dbHolidays.length;

  // Month navigation calculation
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  return (
    <Box sx={{ py: 1 }}>
      {/* Month Selector header */}
      <Card
        sx={{
          mb: 3,
          background: "rgba(19, 19, 31, 0.6)",
          border: "1px solid rgba(99, 102, 241, 0.1)",
        }}
      >
        <CardContent
          sx={{
            py: "12px !important",
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href={`/dashboard?month=${prevMonth}&year=${prevYear}`} style={{ textDecoration: "none" }}>
            <Button
              size="small"
              startIcon={<ChevronLeftRoundedIcon />}
              sx={{ color: "text.primary" }}
            >
              {getIndonesianMonthName(prevMonth).substring(0, 3)}
            </Button>
          </Link>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.light" }}>
            {getIndonesianMonthName(month)} {year}
          </Typography>

          <Link href={`/dashboard?month=${nextMonth}&year=${nextYear}`} style={{ textDecoration: "none" }}>
            <Button
              size="small"
              endIcon={<ChevronRightRoundedIcon />}
              sx={{ color: "text.primary" }}
            >
              {getIndonesianMonthName(nextMonth).substring(0, 3)}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Attendance Clock & Action Buttons */}
      <AttendanceActions todayAttendance={todayAttendance || null} />

      {/* Statistics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Attendance Stat */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ height: "100%", background: "rgba(19,19,31,0.5)" }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "success.main", mb: 1 }}>
                <CheckCircleOutlineRoundedIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "success.main" }}>
                  Kehadiran
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {totalHariMasuk}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hari masuk bulan ini
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Working Hours Stat */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ height: "100%", background: "rgba(19,19,31,0.5)" }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.light", mb: 1 }}>
                <AccessTimeRoundedIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.light" }}>
                  Jam Kerja
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", sm: "1.8rem" } }}>
                {Math.floor(totalWorkingHours)}j {Math.round((totalWorkingHours - Math.floor(totalWorkingHours)) * 60)}m
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total jam kerja aktif
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Alpa/Mangkir Stat */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ height: "100%", background: "rgba(19,19,31,0.5)" }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main", mb: 1 }}>
                <WarningAmberRoundedIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "error.main" }}>
                  Mangkir (Alpa)
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: totalMangkir > 0 ? "error.main" : "text.primary" }}>
                {totalMangkir}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hari kerja tanpa absen
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Holidays Stat */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ height: "100%", background: "rgba(19,19,31,0.5)" }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "warning.main", mb: 1 }}>
                <BeachAccessRoundedIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "warning.main" }}>
                  Hari Libur
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {totalHariLibur}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Libur nasional bulan ini
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main dashboard lists */}
      <Grid container spacing={3}>
        {/* Left Side: Missed days list */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%", background: "rgba(19, 19, 31, 0.6)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <WarningAmberRoundedIcon sx={{ color: "error.main" }} />
                Data Tidak Absen (Mangkir)
              </Typography>

              {mangkirDays.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 4,
                    textAlign: "center",
                    gap: 1.5,
                  }}
                >
                  <Avatar sx={{ bgcolor: "rgba(34,197,94,0.15)", color: "success.main", width: 56, height: 56 }}>
                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>
                    Kerja Bagus!
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 220 }}>
                    Anda tidak melewatkan absensi pada hari kerja di periode ini.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 250, overflowY: "auto", pr: 1 }}>
                  {mangkirDays.map((dateStr) => {
                    const d = new Date(dateStr);
                    const formattedDate = d.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    });
                    return (
                      <Box
                        key={dateStr}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "rgba(239, 68, 68, 0.08)",
                          border: "1px solid rgba(239, 68, 68, 0.15)",
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formattedDate}
                        </Typography>
                        <Chip
                          label="Alpa"
                          size="small"
                          color="error"
                          sx={{ fontSize: "0.65rem", fontWeight: 700, height: 20 }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Last 5 days history */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%", background: "rgba(19, 19, 31, 0.6)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <DateRangeRoundedIcon sx={{ color: "primary.main" }} />
                Histori Terakhir (5 Hari Kerja Terakhir)
              </Typography>

              {lastFiveAttendances.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Belum ada riwayat aktivitas absensi.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ backgroundColor: "transparent", backgroundImage: "none", boxShadow: "none" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ "& th": { borderBottom: "1px solid rgba(99,102,241,0.15)", color: "text.secondary", fontWeight: 600, py: 1.2 } }}>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>Masuk</TableCell>
                        <TableCell>Pulang</TableCell>
                        <TableCell align="right">Jam Kerja</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lastFiveAttendances.map((row) => {
                        const d = new Date(row.date);
                        const dateText = d.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        });
                        const workingHours = calculateWorkingHours(row.check_in, row.check_out);

                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              "& td": { borderBottom: "1px solid rgba(99,102,241,0.08)", py: 1.5 },
                              "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {dateText}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {row.check_in_photo && (
                                  <Tooltip title="Lihat Foto Masuk" arrow>
                                    <Avatar
                                      src={row.check_in_photo}
                                      variant="rounded"
                                      sx={{ width: 24, height: 24, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                  </Tooltip>
                                )}
                                <Typography variant="body2">
                                  {row.check_in ? row.check_in.substring(0, 5) : "-"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {row.check_out_photo && (
                                  <Tooltip title="Lihat Foto Pulang" arrow>
                                    <Avatar
                                      src={row.check_out_photo}
                                      variant="rounded"
                                      sx={{ width: 24, height: 24, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                  </Tooltip>
                                )}
                                <Typography variant="body2">
                                  {row.check_out ? row.check_out.substring(0, 5) : "-"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              {workingHours > 0 ? (
                                <Chip
                                  label={formatWorkingHours(workingHours)}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  sx={{
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    borderColor: "rgba(99,102,241,0.3)",
                                    height: 22,
                                  }}
                                />
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  -
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
