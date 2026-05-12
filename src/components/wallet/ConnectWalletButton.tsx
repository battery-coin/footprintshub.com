"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type EthereumProvider = {
  request: (input: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function connectWallet() {
    setBusy(true);
    setStatus(null);
    try {
      const provider = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
      if (!provider) {
        throw new Error("No browser wallet was found. Enable Coinbase Wallet, WalletConnect, or another EVM wallet first.");
      }
      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
      const chainId = (await provider.request({ method: "eth_chainId" })) as string;
      const walletAddress = accounts[0];
      if (!walletAddress) throw new Error("No wallet address was returned.");

      const nonceResponse = await fetch("/api/wallet/nonce", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ walletAddress, chainId }),
      });
      const noncePayload = (await nonceResponse.json()) as { message?: string; error?: string };
      if (!nonceResponse.ok || !noncePayload.message) throw new Error(noncePayload.error ?? "Could not create a wallet verification nonce.");

      const signature = (await provider.request({
        method: "personal_sign",
        params: [noncePayload.message, walletAddress],
      })) as string;

      const verifyResponse = await fetch("/api/wallet/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          chainId,
          signature,
          message: noncePayload.message,
          walletType: "injected",
          connectorName: "browser_wallet",
        }),
      });
      const verifyPayload = (await verifyResponse.json()) as { error?: string };
      if (!verifyResponse.ok) throw new Error(verifyPayload.error ?? "Wallet verification failed.");

      setAddress(walletAddress);
      setStatus("Wallet verified. This does not authorize a payment.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Wallet connection failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={connectWallet} disabled={busy}>
        {busy ? "Connecting..." : address ? shorten(address) : "Connect wallet"}
      </Button>
      {status ? <p className="text-sm leading-6 text-black/60">{status}</p> : null}
    </div>
  );
}

function shorten(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
