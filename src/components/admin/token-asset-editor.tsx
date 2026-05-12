"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TokenAssetEditor() {
  const [message, setMessage] = useState("");

  async function save(formData: FormData) {
    setMessage("Saving token asset...");
    const response = await fetch("/api/admin/token-assets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        symbol: formData.get("symbol"),
        name: formData.get("name"),
        chain: formData.get("chain"),
        contractAddress: formData.get("contractAddress") || null,
        decimals: Number(formData.get("decimals") || 18),
        enabled: formData.get("enabled") === "on",
        utilityDescription: formData.get("utilityDescription") || null,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? (payload.stored === false ? "Token asset accepted as scaffold until DATABASE_URL is configured." : "Token asset saved.") : payload.error ?? "Could not save token asset.");
  }

  return (
    <form action={save} className="grid gap-4 rounded-lg border border-black/10 bg-white p-5">
      <h2 className="text-xl font-semibold">Battery Coin utility payment asset</h2>
      <p className="text-sm leading-6 text-black/60">Store only public token metadata and receiving/provider configuration. Never enter wallet private keys or seed phrases.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" label="Token name" defaultValue="Battery Coin" />
        <Input name="symbol" label="Symbol" defaultValue="BATT" />
        <Input name="chain" label="Chain" defaultValue="Battery Coin utility network" />
        <Input name="decimals" label="Decimals" defaultValue="18" type="number" />
        <Input name="contractAddress" label="Contract address or public asset ID" />
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-black/60">
        <input name="enabled" type="checkbox" className="h-5 w-5" />
        Enable token asset for configuration
      </label>
      <label className="grid gap-1 text-sm font-medium text-black/60">
        Utility description
        <textarea name="utilityDescription" defaultValue="Utility token payment access for configured FootprintsHub checkout policies." className="min-h-24 rounded-md border border-black/15 px-3 py-2 text-black" />
      </label>
      <Button type="submit">Save token asset</Button>
      {message ? <p className="rounded-md bg-black/[0.04] p-3 text-sm text-black/70">{message}</p> : null}
    </form>
  );
}

function Input({ name, label, defaultValue = "", type = "text" }: { name: string; label: string; defaultValue?: string; type?: string }) {
  return (
    <label className="grid gap-1 text-sm font-medium text-black/60">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} className="min-h-10 rounded-md border border-black/15 px-3 text-black" />
    </label>
  );
}
