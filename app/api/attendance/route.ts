import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

// Helper to get local date string YYYY-MM-DD
function getLocalDateString() {
  const d = new Date();
  // Adjust to Local Timezone (WIB/Mac timezone, we can format using sv-SE locale)
  return d.toLocaleDateString("sv-SE");
}

// Helper to get current time string HH:MM:SS
function getLocalTimeString() {
  const d = new Date();
  return d.toTimeString().split(" ")[0];
}

// GET today's attendance
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const todayStr = getLocalDateString();

  try {
    const attendance = await db("attendances")
      .where({ user_id: userId, date: todayStr })
      .first();

    return NextResponse.json({ attendance: attendance || null });
  } catch (error) {
    console.error("Failed to fetch today's attendance:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST clock-in/out
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { type?: "in" | "out"; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { type, notes } = body;
  if (type !== "in" && type !== "out") {
    return NextResponse.json({ error: "Tipe absensi tidak valid" }, { status: 400 });
  }

  const userId = session.user.id;
  const todayStr = getLocalDateString();
  const timeStr = getLocalTimeString();

  try {
    const existing = await db("attendances")
      .where({ user_id: userId, date: todayStr })
      .first();

    if (type === "in") {
      if (existing) {
        return NextResponse.json(
          { error: "Anda sudah melakukan absen masuk hari ini" },
          { status: 400 }
        );
      }

      const [insertedId] = await db("attendances").insert({
        user_id: userId,
        date: todayStr,
        check_in: timeStr,
        check_in_photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Mock selfie photo
        check_in_notes: notes || null,
      });

      const inserted = await db("attendances").where({ id: insertedId }).first();
      return NextResponse.json({ success: true, attendance: inserted });
    } else {
      // type === 'out'
      if (!existing) {
        return NextResponse.json(
          { error: "Anda belum melakukan absen masuk hari ini" },
          { status: 400 }
        );
      }

      if (existing.check_out) {
        return NextResponse.json(
          { error: "Anda sudah melakukan absen pulang hari ini" },
          { status: 400 }
        );
      }

      await db("attendances")
        .where({ id: existing.id })
        .update({
          check_out: timeStr,
          check_out_photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", // Mock selfie photo
          check_out_notes: notes || null,
          updated_at: db.fn.now(),
        });

      const updated = await db("attendances").where({ id: existing.id }).first();
      return NextResponse.json({ success: true, attendance: updated });
    }
  } catch (error) {
    console.error("Failed to submit attendance:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
