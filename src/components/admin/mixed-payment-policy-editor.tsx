"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Policy = {
  id?: string;
  name?: string;
  compositionMode: string;
  fiatCurrency: string;
  fiatPercentageBps: number;
  tokenPercentageBps: number;
  tokenAssetId?: string | null;
  requireExactRatio?: boolean;
  roundingMode?: string;
};

type TokenAsset = {
  id: string;
  symbol: string;
  name: string;
  enabled: boolean;
};

const presets = [
  [10000, 0, "100% USD / 0% Token"],
  [7500, 2500, "75% USD / 25% Token"],
  [5000, 5000, "50% USD / 50% Token"],
  [2500, 7500, "25% USD / 75% Token"],
  [0, 10000, "0% USD / 100% Token"],
] as const;

export function MixedPaymentPolicyEditor({ policy, tokenAssets }: { policy: Policy; tokenAssets: TokenAsset[] }) {
  const [fiatBps, setFiatBps] = useState(policy.fiatPercentageBps ?? 10000);
  const [tokenBps, setTokenBps] = useState(policy.tokenPercentageBps ?? 0);
  const [tokenAssetId, setTokenAssetId] = useState(policy.tokenAssetId ?? tokenAssets[0]?.id ?? "");
  const [compositionMode, setCompositionMode] = useState(policy.compositionMode ?? "fiat_only");
  const [roundingMode, setRoundingMode] = useState(policy.roundingMode ?? "nearest_cent");
  const [message, setMessage] = useState("");

  const preview = useMemo(() => {
    const totalCents = 10000;
    const fiatCents = Math.round((totalCents * fiatBps) / 10000);
    return { fiatCents, tokenCents: totalCents - fiatCents, valid: fiatBps + tokenBps === 10000 };
  }, [fiatBps, tokenBps]);

  async function save() {
    setMessage("Saving mixed payment policy...");
    const response = await fetch("/api/admin/payment-policies/global", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Global mixed payment policy",
        status: "active",
        compositionMode,
        fiatCurrency: "USD",
        fiatPercentageBps: fiatBps,
        tokenPercentageBps: tokenBps,
        tokenAssetId: tokenAssetId || null,
        appliesTo: "global",
        requireExactRatio: true,
        roundingMode,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? (payload.stored === false ? "Policy accepted as scaffold until DATABASE_URL is configured." : "Payment policy saved.") : payload.error ?? "Could not save payment policy.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-xl font-semibold">Mixed Fiat + Token Payments</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">
          Configure the checkout composition for USD and utility token payment portions. This is payment access only, with no investment, appreciation, yield, or resale-value claims.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {presets.map(([fiat, token, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setFiatBps(fiat);
                setTokenBps(token);
                setCompositionMode(token === 0 ? "fiat_only" : fiat === 0 ? "token_only" : "mixed_ratio");
              }}
              className="rounded-md border border-black/10 px-3 py-2 text-sm hover:bg-black/[0.04]"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-black/60">
            USD portion
            <input type="number" min={0} max={100} step={0.25} value={fiatBps / 100} onChange={(event) => setFiatBps(Math.round(Number(event.target.value) * 100))} className="min-h-10 rounded-md border border-black/15 px-3 text-black" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-black/60">
            Token portion
            <input type="number" min={0} max={100} step={0.25} value={tokenBps / 100} onChange={(event) => setTokenBps(Math.round(Number(event.target.value) * 100))} className="min-h-10 rounded-md border border-black/15 px-3 text-black" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-black/60">
            Composition mode
            <select value={compositionMode} onChange={(event) => setCompositionMode(event.target.value)} className="min-h-10 rounded-md border border-black/15 px-3 text-black">
              {["fiat_only", "token_only", "mixed_ratio", "owner_defined", "product_override", "subscription_override"].map((mode) => (
                <option key={mode} value={mode}>{mode.replaceAll("_", " ")}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-black/60">
            Token asset
            <select value={tokenAssetId} onChange={(event) => setTokenAssetId(event.target.value)} className="min-h-10 rounded-md border border-black/15 px-3 text-black">
              <option value="">No token asset selected</option>
              {tokenAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-black/60">
            Rounding mode
            <select value={roundingMode} onChange={(event) => setRoundingMode(event.target.value)} className="min-h-10 rounded-md border border-black/15 px-3 text-black">
              <option value="nearest_cent">Nearest cent</option>
              <option value="round_up_fiat">Round up USD</option>
              <option value="round_up_token">Round up token</option>
            </select>
          </label>
        </div>

        {!preview.valid ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">USD and token portions must total 100%.</p> : null}
        <div className="mt-6">
          <Button type="button" onClick={save} disabled={!preview.valid}>Save mixed payment policy</Button>
        </div>
        {message ? <p className="mt-4 rounded-md bg-black/[0.04] p-3 text-sm text-black/70">{message}</p> : null}
      </section>

      <aside className="h-fit rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold">Live preview</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="flex justify-between"><span>Product price</span><strong>$100.00</strong></div>
          <div className="flex justify-between"><span>USD required</span><strong>${(preview.fiatCents / 100).toFixed(2)}</strong></div>
          <div className="flex justify-between"><span>Battery Coin portion</span><strong>${(preview.tokenCents / 100).toFixed(2)} equivalent</strong></div>
        </div>
        <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          Token payment support requires token payment provider configuration before live checkout.
        </p>
      </aside>
    </div>
  );
}
