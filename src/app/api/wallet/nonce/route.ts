import { NextResponse } from "next/server";
import { z } from "zod";
import { createWalletNonce } from "@/lib/wallet/wallet-session";

const nonceSchema = z.object({
  walletAddress: z.string().min(1),
  chainId: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const parsed = nonceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "walletAddress is required." }, { status: 400 });
  }

  try {
    const nonce = await createWalletNonce(parsed.data);
    return NextResponse.json(nonce);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create wallet nonce." }, { status: 400 });
  }
}
