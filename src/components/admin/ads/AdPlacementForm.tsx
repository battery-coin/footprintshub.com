"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdPlacementForm() {
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    const response = await fetch("/api/admin/ads/placements", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        locationKey: formData.get("locationKey"),
        dimensions: formData.get("dimensions"),
        placementType: formData.get("placementType"),
        basePriceCents: Math.round(Number(formData.get("basePrice") || 0) * 100),
      }),
    });
    const json = await response.json().catch(() => ({}));
    setMessage(response.ok ? (json.stored === false ? "Validated. Connect Neon to persist this placement." : "Placement saved.") : json.error ?? "Placement save failed.");
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg border border-black/10 bg-white p-6">
      <Input name="name" placeholder="Placement name" required />
      <Input name="locationKey" placeholder="Location key, e.g. homepage_feature" required />
      <select name="placementType" defaultValue="homepage_banner" className="min-h-10 rounded-md border border-black/15 bg-white px-3 py-2 text-sm">
        <option value="homepage_banner">Homepage banner</option>
        <option value="newsletter_feature">Newsletter feature</option>
        <option value="creator_page">Creator page</option>
        <option value="fan_club_page">Fan club page</option>
        <option value="product_feature">Product feature</option>
        <option value="video_pre_roll">Video pre-roll</option>
        <option value="event_sponsor">Event sponsor</option>
        <option value="other">Other</option>
      </select>
      <Input name="dimensions" placeholder="Dimensions, e.g. 1200x400" />
      <Input name="basePrice" type="number" step="0.01" placeholder="Base price" />
      <Button type="submit">Save placement</Button>
      {message ? <p className="text-sm text-black/60">{message}</p> : null}
    </form>
  );
}
