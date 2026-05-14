"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatBpsAsPercent, percentToBps } from "@/lib/money/percentage-bps";
import type { AdminAffiliatePlanView } from "@/lib/affiliate/plan-builder";
import type { AffiliateStructureType, CommissionBase, CommissionType } from "@/lib/affiliate/types";

type LevelRow = AdminAffiliatePlanView["levels"][number];

const commissionTypes: CommissionType[] = ["percentage", "fixed", "percentage_plus_fixed", "store_credit"];
const commissionBases: CommissionBase[] = [
  "product_subtotal",
  "order_subtotal",
  "item_subtotal",
  "direct_commission",
  "leg_volume",
  "weaker_leg_volume",
  "matrix_level_volume",
  "gross_margin",
];
const adminSecretStorageKey = "footprintshub-admin-secret";

function getAdminSecretInput() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("admin_secret") || window.localStorage.getItem(adminSecretStorageKey) || "";
}

function saveAdminSecret(secret: string) {
  if (typeof window === "undefined") return;
  if (secret) window.localStorage.setItem(adminSecretStorageKey, secret);
}

function adminJsonHeaders(secret: string) {
  return { "content-type": "application/json", ...(secret ? { "x-admin-secret": secret } : {}) };
}

function unauthorizedMessage(defaultMessage: string) {
  return `${defaultMessage} Enter the Railway ADMIN_SECRET and try again.`;
}

export function UseStructureTemplateButton({ templateKey, structureType }: { templateKey: string; structureType?: AffiliateStructureType }) {
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const router = useRouter();

  async function useTemplate() {
    setStatus("saving");
    setMessage("");
    try {
      const resolvedAdminSecret = adminSecret.trim() || getAdminSecretInput();
      if (!resolvedAdminSecret) {
        setShowAdminSecret(true);
        setStatus("error");
        setMessage("Admin authorization is required before creating a structure. Enter the Railway ADMIN_SECRET and click again.");
        return;
      }
      saveAdminSecret(resolvedAdminSecret);

      const response = await fetch("/api/admin/affiliates/structures/use-template", {
        method: "POST",
        headers: adminJsonHeaders(resolvedAdminSecret),
        credentials: "same-origin",
        body: JSON.stringify({ templateKey, structureType }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setShowAdminSecret(true);
        }
        setMessage(
          response.status === 401 || response.status === 403
            ? unauthorizedMessage(payload.error ?? "Unauthorized.")
            : payload.error ?? "Could not create this structure. Check owner/admin access and try again.",
        );
        setStatus("error");
        return;
      }

      setShowAdminSecret(false);
      setMessage(payload.stored === false ? "Preview created. Connect DATABASE_URL for persistence." : "Structure created. Opening settings...");
      router.push(payload.redirectTo ?? "/admin/affiliates/plans");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not reach the structure setup API.");
      return;
    }
  }

  return (
    <div className="grid gap-2">
      {showAdminSecret || status === "error" ? (
        <label className="grid gap-1 text-xs font-medium text-black/55">
          Admin secret
          <input
            type="password"
            value={adminSecret}
            onChange={(event) => setAdminSecret(event.target.value)}
            placeholder="Enter admin secret"
            className="min-h-10 rounded-md border border-black/15 px-3 text-sm text-black"
          />
        </label>
      ) : null}
      <Button type="button" onClick={useTemplate} disabled={status === "saving"}>
        {status === "saving" ? "Creating..." : status === "error" ? "Try again" : "Use This Structure"}
      </Button>
      {message ? <p className={status === "error" ? "text-sm text-red-600" : "text-sm text-black/60"}>{message}</p> : null}
    </div>
  );
}

export function PlanLevelsEditor({ plan }: { plan: AdminAffiliatePlanView }) {
  const [levels, setLevels] = useState<LevelRow[]>(plan.levels);
  const [message, setMessage] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  function updateLevel(index: number, patch: Partial<LevelRow>) {
    setLevels((current) => current.map((level, levelIndex) => (levelIndex === index ? { ...level, ...patch } : level)));
  }

  async function saveLevels() {
    const resolvedAdminSecret = adminSecret.trim() || getAdminSecretInput();
    if (!resolvedAdminSecret) {
      setShowAdminSecret(true);
      setMessage("Admin authorization is required to save levels. Enter the Railway ADMIN_SECRET and try again.");
      return;
    }
    saveAdminSecret(resolvedAdminSecret);
    setMessage("Saving level labels and percentages...");
    const response = await fetch(`/api/admin/affiliates/plans/${plan.id}/levels`, {
      method: "PUT",
      headers: adminJsonHeaders(resolvedAdminSecret),
      body: JSON.stringify({ levels }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok && (response.status === 401 || response.status === 403)) setShowAdminSecret(true);
    setMessage(
      response.ok
        ? payload.stored === false
          ? "Accepted in setup mode until DATABASE_URL is configured."
          : "Levels saved."
        : response.status === 401 || response.status === 403
          ? unauthorizedMessage(payload.error ?? "Unauthorized.")
          : payload.error ?? "Could not save levels.",
    );
  }

  async function activatePlan() {
    const resolvedAdminSecret = adminSecret.trim() || getAdminSecretInput();
    if (!resolvedAdminSecret) {
      setShowAdminSecret(true);
      setMessage("Admin authorization is required to activate plans. Enter the Railway ADMIN_SECRET and try again.");
      return;
    }
    saveAdminSecret(resolvedAdminSecret);
    setMessage("Activating plan...");
    const response = await fetch(`/api/admin/affiliates/plans/${plan.id}/activate`, { method: "POST", headers: adminJsonHeaders(resolvedAdminSecret) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok && (response.status === 401 || response.status === 403)) setShowAdminSecret(true);
    setMessage(
      response.ok
        ? payload.stored === false
          ? "Activation accepted in setup mode until DATABASE_URL is configured."
          : "Plan activated."
        : response.status === 401 || response.status === 403
          ? unauthorizedMessage(payload.error ?? "Unauthorized.")
          : payload.error ?? "Could not activate plan.",
    );
  }

  async function duplicatePlan() {
    const resolvedAdminSecret = adminSecret.trim() || getAdminSecretInput();
    if (!resolvedAdminSecret) {
      setShowAdminSecret(true);
      setMessage("Admin authorization is required to duplicate plans. Enter the Railway ADMIN_SECRET and try again.");
      return;
    }
    saveAdminSecret(resolvedAdminSecret);
    setMessage("Duplicating plan...");
    const response = await fetch(`/api/admin/affiliates/plans/${plan.id}/duplicate`, { method: "POST", headers: adminJsonHeaders(resolvedAdminSecret) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok && (response.status === 401 || response.status === 403)) setShowAdminSecret(true);
    setMessage(
      response.ok
        ? `Duplicate ready: ${payload.planId ?? "draft copy"}`
        : response.status === 401 || response.status === 403
          ? unauthorizedMessage(payload.error ?? "Unauthorized.")
          : payload.error ?? "Could not duplicate plan.",
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-xl font-semibold">Editable level labels and rates</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">
          Percentages are stored as basis points. Example: 10% is saved as 1000 bps. Binary, Matrix, and Unilevel settings persist to the database for owner-managed plan setup.
        </p>
        <div className="mt-5 grid gap-3">
          {levels.map((level, index) => (
            <div key={`${level.levelDepth}-${level.label}`} className="grid gap-3 rounded-lg border border-black/10 p-4 lg:grid-cols-[80px_1fr_130px_150px_150px]">
              <label className="grid gap-1 text-xs font-medium text-black/55">
                Enabled
                <input
                  type="checkbox"
                  checked={level.enabled}
                  onChange={(event) => updateLevel(index, { enabled: event.target.checked })}
                  className="h-5 w-5"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-black/55">
                Label
                <input
                  value={level.label}
                  onChange={(event) => updateLevel(index, { label: event.target.value })}
                  className="min-h-10 rounded-md border border-black/15 px-3 text-sm text-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-black/55">
                Type
                <select
                  value={level.commissionType}
                  onChange={(event) => updateLevel(index, { commissionType: event.target.value as CommissionType })}
                  className="min-h-10 rounded-md border border-black/15 px-3 text-sm text-black"
                >
                  {commissionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-medium text-black/55">
                Percentage
                <input
                  value={formatBpsAsPercent(level.percentageBps)}
                  onChange={(event) => {
                    try {
                      updateLevel(index, { percentageBps: percentToBps(event.target.value) });
                    } catch {
                      updateLevel(index, { percentageBps: undefined });
                    }
                  }}
                  className="min-h-10 rounded-md border border-black/15 px-3 text-sm text-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-black/55">
                Base
                <select
                  value={level.commissionBase}
                  onChange={(event) => updateLevel(index, { commissionBase: event.target.value as CommissionBase })}
                  className="min-h-10 rounded-md border border-black/15 px-3 text-sm text-black"
                >
                  {commissionBases.map((base) => (
                    <option key={base} value={base}>
                      {base.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold">Plan actions</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">Save labels and rates first, then activate after reviewing compliance warnings and commission pool caps.</p>
        {showAdminSecret ? (
          <label className="mt-5 grid gap-1 text-xs font-medium text-black/55">
            Admin secret
            <input
              type="password"
              value={adminSecret}
              onChange={(event) => setAdminSecret(event.target.value)}
              placeholder="Enter admin secret"
              className="min-h-10 rounded-md border border-black/15 px-3 text-sm text-black"
            />
          </label>
        ) : null}
        <div className="mt-5 grid gap-3">
          <Button type="button" onClick={saveLevels}>
            Save levels
          </Button>
          <Button type="button" variant="secondary" onClick={activatePlan}>
            Activate Plan
          </Button>
          <Button type="button" variant="secondary" onClick={duplicatePlan}>
            Duplicate Plan
          </Button>
        </div>
        {message ? <p className="mt-4 rounded-md bg-black/[0.04] p-3 text-sm text-black/70">{message}</p> : null}
      </div>
    </div>
  );
}

export function StructureSettingsForm({
  planId,
  structureType,
  fields,
}: {
  planId: string;
  structureType: AffiliateStructureType;
  fields: Array<{ name: string; label: string; value: string | number | boolean; type?: "text" | "number" | "checkbox" }>;
}) {
  const [message, setMessage] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showAdminSecret, setShowAdminSecret] = useState(false);

  async function saveSettings(formData: FormData) {
    const resolvedAdminSecret = adminSecret.trim() || getAdminSecretInput();
    if (!resolvedAdminSecret) {
      setShowAdminSecret(true);
      setMessage("Admin authorization is required to save settings. Enter the Railway ADMIN_SECRET and try again.");
      return;
    }
    saveAdminSecret(resolvedAdminSecret);
    const payload = Object.fromEntries(
      fields.map((field) => [field.name, field.type === "checkbox" ? formData.get(field.name) === "on" : formData.get(field.name)]),
    );
    const response = await fetch(`/api/admin/affiliates/plans/${planId}/${structureType}`, {
      method: "PUT",
      headers: adminJsonHeaders(resolvedAdminSecret),
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok && (response.status === 401 || response.status === 403)) setShowAdminSecret(true);
    setMessage(
      response.ok
        ? body.stored === false
          ? "Settings accepted in setup mode until DATABASE_URL is configured."
          : "Settings saved."
        : response.status === 401 || response.status === 403
          ? unauthorizedMessage(body.error ?? "Unauthorized.")
          : body.error ?? "Could not save settings.",
    );
  }

  return (
    <form action={saveSettings} className="grid gap-4 rounded-lg border border-black/10 bg-white p-5">
      {showAdminSecret ? (
        <label className="grid gap-1 text-xs font-medium text-black/55">
          Admin secret
          <input
            type="password"
            value={adminSecret}
            onChange={(event) => setAdminSecret(event.target.value)}
            placeholder="Enter admin secret"
            className="min-h-10 rounded-md border border-black/15 px-3 text-sm text-black"
          />
        </label>
      ) : null}
      {fields.map((field) => (
        <label key={field.name} className="grid gap-1 text-sm font-medium text-black/60">
          {field.label}
          {field.type === "checkbox" ? (
            <input name={field.name} type="checkbox" defaultChecked={Boolean(field.value)} className="h-5 w-5" />
          ) : (
            <input
              name={field.name}
              type={field.type ?? "text"}
              defaultValue={String(field.value)}
              className="min-h-10 rounded-md border border-black/15 px-3 text-sm text-black"
            />
          )}
        </label>
      ))}
      <Button type="submit">Save settings</Button>
      {message ? <p className="rounded-md bg-black/[0.04] p-3 text-sm text-black/70">{message}</p> : null}
    </form>
  );
}
