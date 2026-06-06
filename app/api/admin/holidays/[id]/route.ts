import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await checkAdmin();
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  // Next.js 16 parameters are async / Promises
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID hari libur wajib disertakan" }, { status: 400 });
  }

  try {
    const deleted = await db("holidays").where({ id }).delete();

    if (!deleted) {
      return NextResponse.json({ error: "Hari libur tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete holiday:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
