import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-black/10 bg-white p-5 ${className}`}>{children}</div>;
}

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <Card>
      <p className="text-sm text-black/55">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-black/55">{detail}</p> : null}
    </Card>
  );
}

