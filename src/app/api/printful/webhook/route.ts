import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const configuredSecret = process.env.PRINTFUL_WEBHOOK_SECRET;

  if (configuredSecret) {
    const providedSecret = request.headers.get("x-footprintshub-printful-secret");
    if (providedSecret !== configuredSecret) {
      return NextResponse.json({ error: "Invalid Printful webhook secret." }, { status: 401 });
    }
  }

  const event = await request.json().catch(() => null);

  return NextResponse.json({
    ok: true,
    stored: false,
    message: "Printful webhook received. Connect PrintfulOrder persistence before production automation.",
    eventType: typeof event === "object" && event && "type" in event ? event.type : "unknown",
  });
}

