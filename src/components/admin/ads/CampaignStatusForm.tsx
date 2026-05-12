"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

export function CampaignStatusForm({ campaignId }: { campaignId: string }) {
  const [status, setStatus] = useState("approved");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  async function submit() {
    const response = await fetch(`/api/admin/ads/campaigns/${campaignId}/status`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status, adminNotes: notes, rejectionReason: status === "rejected" ? notes : undefined }),
    });
    const json = await response.json().catch(() => ({}));
    setMessage(response.ok ? (json.stored === false ? "Validated. Connect Neon to persist this status." : "Campaign status updated.") : json.error ?? "Status update failed.");
  }

  return (
    <div className="grid gap-3 rounded-lg border border-black/10 bg-white p-5">
      <h2 className="font-semibold">Review action</h2>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-10 rounded-md border border-black/15 bg-white px-3 py-2 text-sm">
        <option value="approved">Approve</option>
        <option value="scheduled">Schedule</option>
        <option value="live">Mark live</option>
        <option value="paused">Pause</option>
        <option value="completed">Complete</option>
        <option value="rejected">Reject</option>
        <option value="cancelled">Cancel</option>
      </select>
      <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Admin notes or rejection reason" />
      <Button type="button" onClick={submit}>Save status</Button>
      {message ? <p className="text-sm text-black/60">{message}</p> : null}
    </div>
  );
}
