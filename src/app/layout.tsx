import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartButton } from "@/components/cart/cart-button";
import { CartDrawer } from "@/components/cart/cart-drawer";

export const metadata: Metadata = {
  title: "FootprintsHub Commerce",
  description:
    "FootprintsHub store for collectibles, supporter bundles, fan club merchandise, booster packs, and digital unlocks.",
};

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/products", label: "Products" },
  { href: "/collections", label: "Collections" },
  { href: "/collections/footprints", label: "Footprints" },
  { href: "/affiliate", label: "Ambassadors" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <header className="sticky top-0 z-40 border-b border-black/10 bg-[rgba(247,245,240,0.92)] backdrop-blur">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3 font-semibold tracking-wide">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                    <ShoppingBag size={18} aria-hidden="true" />
                  </span>
                  <span>FootprintsHub</span>
                </Link>
                <nav className="hidden items-center gap-6 text-sm text-black/70 md:flex">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="hover:text-black">
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <CartButton />
              </div>
            </header>
            {children}
            <footer className="border-t border-black/10 bg-black text-white">
              <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-5 lg:px-8">
                <div className="md:col-span-2">
                  <p className="text-lg font-semibold">FootprintsHub</p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                    Standalone commerce for Footprints, Matrix Decoded, Hero Studio creator drops, collectibles, merch, and future digital unlocks.
                  </p>
                </div>
                <FooterLinks title="Shop" links={["/shop", "/products", "/collections", "/cart"]} />
                <FooterLinks
                  title="Legal"
                  links={[
                    "/legal/terms",
                    "/legal/privacy",
                    "/legal/refunds",
                    "/legal/shipping",
                    "/legal/preorders",
                    "/legal/fan-club-disclaimer",
                    "/legal/digital-goods",
                  ]}
                />
                <FooterLinks title="Support" links={["/contact", "/support", "/faq", "/affiliate", "/admin"]} />
              </div>
            </footer>
            <CartDrawer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="font-medium">{title}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm text-white/65">
        {links.map((href) => (
          <Link key={href} href={href} className="hover:text-white">
            {href === "/cart" ? "Cart" : href.split("/").pop()?.replaceAll("-", " ")}
          </Link>
        ))}
      </div>
    </div>
  );
}
