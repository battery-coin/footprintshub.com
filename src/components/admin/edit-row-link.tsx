import { Pencil } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function EditRowLink({ href, label = "Edit" }: { href: string; label?: string }) {
  return (
    <ButtonLink href={href} variant="secondary" className="min-h-8 px-3 py-1.5 text-xs">
      <Pencil size={13} aria-hidden="true" />
      {label}
    </ButtonLink>
  );
}
