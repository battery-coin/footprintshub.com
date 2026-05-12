import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Token payment processor is not enabled yet. Configure provider or use owner manual verification after legal review.",
    },
    { status: 503 },
  );
}
