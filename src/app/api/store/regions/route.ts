import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    regions: [
      {
        id: "us-default",
        name: "United States",
        currencyCode: "USD",
        countries: ["US"],
        taxInclusive: false,
        active: true,
      },
    ],
  });
}
