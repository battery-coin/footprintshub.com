import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyWalletSignature } from "@/lib/wallet/wallet-session";

const verifySchema = z.object({
  walletAddress: z.string().min(1),
  message: z.string().min(1),
  signature: z.string().min(1),
  chainId: z.string().optional().nullable(),
  walletType: z.string().optional().nullable(),
  connectorName: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  shopId: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const parsed = verifySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid wallet verification payload." }, { status: 400 });
  }

  try {
    const wallet = await verifyWalletSignature(parsed.data);
    return NextResponse.json({
      ok: true,
      wallet: {
        id: wallet.id,
        walletAddress: wallet.walletAddress,
        chainId: wallet.chainId,
        walletType: wallet.walletType,
        connectorName: wallet.connectorName,
        verifiedAt: wallet.verifiedAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Wallet verification failed." }, { status: 400 });
  }
}
