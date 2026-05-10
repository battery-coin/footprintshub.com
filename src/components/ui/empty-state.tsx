import type { ReactNode } from "react";
import { ButtonLink } from "./button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-black/15 bg-white/70 p-8 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-black/60">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
      {actionHref && actionLabel ? (
        <div className="mt-6 flex justify-center">
          <ButtonLink href={actionHref}>{actionLabel}</ButtonLink>
        </div>
      ) : null}
    </div>
  );
}

