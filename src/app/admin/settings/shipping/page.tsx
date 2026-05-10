import { AdminShell } from "@/components/admin/admin-shell";
import { SetupPanel } from "@/components/ui/setup-panel";

export default function AdminShippingSettingsPage() {
  return (
    <AdminShell>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Shipping</p>
        <h1 className="mt-3 text-4xl font-semibold">Shipping settings</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          MVP shipping uses flat-rate configuration and explicit digital-only skip rules. Carrier integrations and Printful live rates can be added later.
        </p>
        <div className="mt-8">
          <SetupPanel
            title="Shipping readiness"
            description="Physical products require address collection. Digital-only carts can skip shipping when the cart validator confirms no physical items."
            items={[
              { label: "DEFAULT_SHIPPING_FLAT_RATE_CENTS", complete: Boolean(process.env.DEFAULT_SHIPPING_FLAT_RATE_CENTS), detail: "Flat-rate shipping fallback for physical orders." },
              { label: "DEFAULT_FREE_SHIPPING_THRESHOLD_CENTS", complete: Boolean(process.env.DEFAULT_FREE_SHIPPING_THRESHOLD_CENTS), detail: "Optional free-shipping threshold." },
              { label: "PRINTFUL_API_KEY", complete: Boolean(process.env.PRINTFUL_API_KEY), detail: "Required before automatic print-on-demand submission." },
            ]}
          />
        </div>
      </div>
    </AdminShell>
  );
}

