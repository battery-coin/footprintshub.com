"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function CreativeSubmissionForm({ campaignId }: { campaignId: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setState("saving");
    setMessage("");
    const response = await fetch("/api/ads/creative", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        campaignId,
        type: formData.get("type"),
        title: formData.get("title"),
        imageUrl: formData.get("imageUrl"),
        videoUrl: formData.get("videoUrl"),
        targetUrl: formData.get("targetUrl"),
        altText: formData.get("altText"),
        text: formData.get("text"),
        notes: formData.get("notes"),
      }),
    });
    const json = await response.json().catch(() => ({}));
    setState(response.ok ? "saved" : "error");
    setMessage(response.ok ? "Creative submitted for review." : json.error ?? "Creative submission failed.");
  }

  return (
    <form action={onSubmit} className="grid gap-4 rounded-lg border border-black/10 bg-white p-5">
      <h2 className="text-xl font-semibold">Submit creative</h2>
      <select name="type" defaultValue="image" className="min-h-10 rounded-md border border-black/15 bg-white px-3 py-2 text-sm">
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="text">Text</option>
        <option value="social_copy">Social copy</option>
      </select>
      <Input name="title" placeholder="Creative title or headline" />
      <Input name="imageUrl" placeholder="Image URL" />
      <Input name="videoUrl" placeholder="Video URL" />
      <Input name="targetUrl" placeholder="https://target.example.com" required />
      <Input name="altText" placeholder="Alt text" />
      <Textarea name="text" placeholder="Body copy or social copy" />
      <Textarea name="notes" placeholder="Notes for the review team" />
      <Button type="submit" disabled={state === "saving"}>{state === "saving" ? "Submitting..." : "Submit for review"}</Button>
      {message ? <p className={state === "error" ? "text-sm text-red-700" : "text-sm text-emerald-700"}>{message}</p> : null}
    </form>
  );
}
