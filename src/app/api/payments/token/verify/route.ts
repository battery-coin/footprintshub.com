import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Automatic token payment verification is not enabled yet.",
    },
    { status: 503 },
  );
}
