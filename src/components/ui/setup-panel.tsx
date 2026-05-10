import { StatusBadge } from "./status-badge";

export function SetupPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{
    label: string;
    complete: boolean;
    detail: string;
  }>;
}) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">{description}</p>
        </div>
        <StatusBadge tone={items.every((item) => item.complete) ? "good" : "warn"}>
          {items.every((item) => item.complete) ? "Configured" : "Setup required"}
        </StatusBadge>
      </div>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2 rounded-md bg-black/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="mt-1 text-sm leading-6 text-black/58">{item.detail}</p>
            </div>
            <StatusBadge tone={item.complete ? "good" : "warn"}>{item.complete ? "Ready" : "Needs setup"}</StatusBadge>
          </div>
        ))}
      </div>
    </section>
  );
}

