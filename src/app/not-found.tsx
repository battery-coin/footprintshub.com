import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
        <SearchX size={24} aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-4xl font-semibold">We could not find that page.</h1>
      <p className="mt-4 text-base leading-7 text-black/60">
        The link may have moved as FootprintsHub grows into the Hero Studio commerce engine. Try the shop, collections, FAQ, or support center.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/shop" variant="secondary">Back to shop</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">Contact support</ButtonLink>
      </div>
    </main>
  );
}
