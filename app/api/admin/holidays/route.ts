import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import Joi from "joi";

const holidaySchema = Joi.object({
  holiday_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Format tanggal harus YYYY-MM-DD",
      "any.required": "Tanggal libur wajib diisi",
    }),
  description: Joi.string().max(255).required().messages({
    "string.max": "Keterangan maksimal 255 karakter",
    "any.required": "Keterangan libur wajib diisi",
  }),
});

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
    const holidays = await db("holidays").select("*").orderBy("holiday_date", "asc");
    return NextResponse.json({ holidays });
  } catch (error) {
    console.error("Failed to fetch holidays:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const check = await checkAdmin();
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate request body
  const { error, value } = holidaySchema.validate(body);
  if (error) {
    return NextResponse.json({ error: error.details[0].message }, { status: 400 });
  }

  const { holiday_date, description } = value;

  try {
    // Check if holiday already exists
    const existing = await db("holidays").where({ holiday_date }).first();
    if (existing) {
      return NextResponse.json(
        { error: "Hari libur pada tanggal tersebut sudah terdaftar" },
        { status: 400 }
      );
    }

    const [insertedId] = await db("holidays").insert({
      holiday_date,
      description,
    });

    const inserted = await db("holidays").where({ id: insertedId }).first();

    return NextResponse.json({ success: true, holiday: inserted });
  } catch (error) {
    console.error("Failed to add holiday:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
