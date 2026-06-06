import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Box } from "@mui/material";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import AdminPanel from "@/components/admin/AdminPanel";
import { formatDbDate } from "@/lib/date-utils";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Manajemen pengguna dan hari libur nasional CoreHR",
};

export default async function AdminPage() {
  const session = await auth();
  const user = session?.user;

  // Extra safety check (middleware already protects this route)
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch initial users from DB
  const dbUsers = await db("users")
    .select("id", "name", "email", "avatar_url", "role", "status", "created_at")
    .orderByRaw("status = 'unverified' DESC") // Unverified first
    .orderBy("name", "asc");

  // Format dates so they are safe to pass to client component (serialize dates to string)
  const users = dbUsers.map((u) => ({
    ...u,
    id: Number(u.id),
    created_at: u.created_at ? new Date(u.created_at).toISOString() : "",
  }));

  // Fetch initial holidays from DB
  const dbHolidays = await db("holidays")
    .select("id", "holiday_date", "description")
    .orderBy("holiday_date", "asc");

  const holidays = dbHolidays.map((h) => ({
    id: Number(h.id),
    holiday_date: formatDbDate(h.holiday_date),
    description: h.description,
  }));

  return (
    <Box>
      <AdminPanel
        initialUsers={users}
        initialHolidays={holidays}
        currentUserId={String(user.id)}
      />
    </Box>
  );
}
