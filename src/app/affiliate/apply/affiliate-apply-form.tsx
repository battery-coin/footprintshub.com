"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function AffiliateApplyForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || undefined,
      notes: String(formData.get("notes") ?? "") || undefined,
      parentReferralCode: String(formData.get("parentReferralCode") ?? "") || undefined,
      acceptedTerms: formData.get("acceptedTerms") === "on",
      acceptedDisclosure: formData.get("acceptedDisclosure") === "on",
    };

    try {
      const response = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string; error?: string; stored?: boolean };

      if (!response.ok) {
        throw new Error(result.error ?? "Application could not be submitted.");
      }

      setState("success");
      setMessage(
        result.stored
          ? "Application submitted. An admin can review it from the affiliate control panel."
          : result.message ?? "Application validated. Configure DATABASE_URL to store applications.",
      );
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Application could not be submitted.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-lg border border-black/10 bg-white p-5">
      <Input name="name" placeholder="Display name" minLength={2} required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" placeholder="Phone, optional" />
      <Input name="parentReferralCode" placeholder="Parent ambassador code, optional" />
      <Textarea name="notes" placeholder="Tell us how you plan to share FootprintsHub products" />
      <label className="flex gap-3 text-sm leading-6 text-black/65">
        <input name="acceptedTerms" type="checkbox" className="mt-1" required />
        I accept the affiliate terms and understand commissions are paid only on qualified purchases.
      </label>
      <label className="flex gap-3 text-sm leading-6 text-black/65">
        <input name="acceptedDisclosure" type="checkbox" className="mt-1" required />
        I understand public affiliate disclosure is required when sharing links, coupons, posts, or recommendations.
      </label>
      <Button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting..." : "Submit application"}
      </Button>
      {message ? (
        <p className={`rounded-md p-3 text-sm leading-6 ${state === "error" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

