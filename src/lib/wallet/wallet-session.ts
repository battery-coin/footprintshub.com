import { randomBytes } from "node:crypto";
import { verifyMessage } from "viem";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { getSiteUrl } from "@/lib/url/site-url";

const WALLET_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function normalizeWalletAddress(address: string) {
  const walletAddress = address.trim().toLowerCase();
  if (!WALLET_ADDRESS_RE.test(walletAddress)) {
    throw new Error("Valid EVM wallet address required.");
  }
  return walletAddress;
}

export function isWalletConnectEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_WALLET_CONNECT === "true";
}

export function buildWalletSignInMessage({
  walletAddress,
  chainId,
  nonce,
  issuedAt,
  expiresAt,
}: {
  walletAddress: string;
  chainId?: string | null;
  nonce: string;
  issuedAt: Date;
  expiresAt: Date;
}) {
  const domain = new URL(getSiteUrl()).host;
  return [
    `${domain} wants you to verify wallet ownership.`,
    "",
    "FootprintsHub uses this signature only to prove wallet ownership. It does not authorize token transfers or payments.",
    "",
    `Address: ${walletAddress}`,
    `Chain ID: ${chainId ?? "unknown"}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt.toISOString()}`,
    `Expires At: ${expiresAt.toISOString()}`,
  ].join("\n");
}

export async function createWalletNonce(input: { walletAddress: string; chainId?: string | null }) {
  if (!hasDatabaseUrl()) {
    throw new Error("Wallet verification requires DATABASE_URL.");
  }
  const walletAddress = normalizeWalletAddress(input.walletAddress);
  const nonce = randomBytes(24).toString("hex");
  const issuedAt = new Date();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const message = buildWalletSignInMessage({ walletAddress, chainId: input.chainId, nonce, issuedAt, expiresAt });

  await getPrisma().walletVerificationNonce.create({
    data: {
      walletAddress,
      nonce,
      message,
      expiresAt,
    },
  });

  return { nonce, message, expiresAt };
}

export async function verifyWalletSignature(input: {
  walletAddress: string;
  message: string;
  signature: string;
  chainId?: string | null;
  walletType?: string | null;
  connectorName?: string | null;
  userId?: string | null;
  customerId?: string | null;
  shopId?: string | null;
}) {
  if (!hasDatabaseUrl()) {
    throw new Error("Wallet verification requires DATABASE_URL.");
  }
  const walletAddress = normalizeWalletAddress(input.walletAddress);
  const prisma = getPrisma();
  const nonceRow = await prisma.walletVerificationNonce.findFirst({
    where: {
      walletAddress,
      message: input.message,
      status: "pending",
      expiresAt: { gt: new Date() },
    },
  });

  if (!nonceRow) {
    throw new Error("Wallet nonce is missing, expired, or already used.");
  }

  const verified = await verifyMessage({
    address: walletAddress as `0x${string}`,
    message: input.message,
    signature: input.signature as `0x${string}`,
  });

  if (!verified) {
    throw new Error("Wallet signature did not match the requested address.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.walletVerificationNonce.update({
      where: { id: nonceRow.id },
      data: { status: "used", usedAt: new Date() },
    });

    const existing = await tx.walletConnection.findFirst({
      where: {
        walletAddress,
        shopId: input.shopId ?? null,
        userId: input.userId ?? null,
      },
    });

    if (existing) {
      return tx.walletConnection.update({
        where: { id: existing.id },
        data: {
          chainId: input.chainId ?? existing.chainId,
          walletType: input.walletType ?? existing.walletType,
          connectorName: input.connectorName ?? existing.connectorName,
          customerId: input.customerId ?? existing.customerId,
          verifiedAt: new Date(),
          lastSeenAt: new Date(),
        },
      });
    }

    return tx.walletConnection.create({
      data: {
        shopId: input.shopId ?? null,
        userId: input.userId ?? null,
        customerId: input.customerId ?? null,
        walletAddress,
        chainId: input.chainId ?? null,
        walletType: input.walletType ?? "injected",
        connectorName: input.connectorName ?? null,
        verifiedAt: new Date(),
        lastSeenAt: new Date(),
      },
    });
  });
}
