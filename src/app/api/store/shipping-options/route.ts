import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    shippingOptions: [
      {
        id: "flat-us",
        name: "Standard shipping",
        priceCents: 799,
        currency: "USD",
        active: true,
      },
      {
        id: "digital-only",
        name: "Digital delivery",
        priceCents: 0,
        currency: "USD",
        active: true,
      },
    ],
  });
}
