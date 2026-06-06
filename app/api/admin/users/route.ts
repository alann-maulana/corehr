import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

// Middleware checks if session exists and role is admin
async function checkAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 };
  }
  if (session.user.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }
  return { user: session.user };
}

export async function GET() {
  const check = await checkAdmin();
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  try {
    const users = await db("users")
      .select("id", "name", "email", "avatar_url", "role", "status", "created_at")
      .orderByRaw("status = 'unverified' DESC") // Unverified first
      .orderBy("name", "asc");

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const check = await checkAdmin();
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  let body: { userId?: number; role?: "admin" | "employee"; status?: "verified" | "unverified" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { userId, role, status } = body;

  if (!userId) {
    return NextResponse.json({ error: "userId wajib disertakan" }, { status: 400 });
  }

  // Prevent self-demotion / self-deverification
  if (String(userId) === check.user?.id) {
    return NextResponse.json(
      { error: "Anda tidak dapat mengubah status atau role akun Anda sendiri" },
      { status: 400 }
    );
  }

  try {
    const updateData: Record<string, string> = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Tidak ada field yang diupdate" }, { status: 400 });
    }

    const updated = await db("users").where({ id: userId }).update(updateData);

    if (!updated) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
