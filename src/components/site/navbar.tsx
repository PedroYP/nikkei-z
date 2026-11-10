"use client";

/* ============================================================
   Navbar · fija, se vuelve vidrio al hacer scroll
   ============================================================ */

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "@/lib/router";
import { useCart, cartCount } from "@/lib/cart-store";
import { SITE } from "@/lib/data";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio", view: "home" },
  { href: "/nosotros", label: "Nosotros", view: "about" },
  { href: "/carta", label: "La Carta", view: "menu" },
  { href: "/contacto", label: "Contacto", view: "contact" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <circle cx="32" cy="32" r="17" fill="none" stroke="#C9A24B" strokeWidth="3.2" />
        <circle cx="32" cy="32" r="9" fill="#F2EDE3" />
        <circle cx="32" cy="32" r="4.2" fill="#E8623C" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-2xl font-semibold tracking-[0.18em] text-cream">
          SUMI
        </span>
        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.42em] text-gold/90">
          Maki · Nikkei
        </span>
      </span>
    </span>
  );
}

const noopSubscribe = () => () => {};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /* Hidratación segura sin setState síncrono en efectos */
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const { route, navigate } = useRouter();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cierra el menú móvil si la ruta cambia (p. ej. botón atrás) */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(raf);
  }, [route]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-gold/10 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      {/* Barra superior fina: horario + delivery */}
      <div
        className={cn(
          "hidden items-center justify-center gap-6 overflow-hidden border-b border-gold/10 bg-ink/60 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground backdrop-blur-md transition-all duration-500 lg:flex",
          scrolled ? "h-0 border-transparent opacity-0" : "h-9 opacity-100"
        )}
      >
        <span>Miraflores · Lima</span>
        <span className="text-gold">✦</span>
        <span>Delivery en 25 min promedio</span>
        <span className="text-gold">✦</span>
        <span>Mar – Dom · 13:00 a 23:00</span>
      </div>

      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[74px]"
      >
        <Link
          href="/"
          aria-label="SUMI — volver al inicio"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>

        {/* Links desktop */}
        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              route.view === link.view ||
              (link.view === "menu" && route.view === "product");
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.href);
                  }}
                  className={cn(
                    "link-underline text-[13px] font-semibold uppercase tracking-[0.2em] transition-colors",
                    active ? "text-gold" : "text-cream/80 hover:text-cream"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          {/* Botón carrito */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito de compras${mounted && count > 0 ? `, ${count} productos` : ""}`}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-cream transition-all duration-300 hover:border-gold hover:bg-gold/10"
            )}
          >
            <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
            {mounted && count > 0 ? (
              <span
                key={count}
                aria-hidden="true"
                className="badge-pop absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-bold text-ink"
              >
                {count}
              </span>
            ) : null}
          </button>

          {/* CTA desktop */}
          <button
            type="button"
            onClick={() => navigate("/carta")}
            className="btn-gold hidden h-11 items-center rounded-full px-6 text-[12px] font-bold uppercase tracking-[0.18em] sm:inline-flex"
          >
            Pide ahora
          </button>

          {/* Menú móvil */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              asChild
              className="lg:hidden"
              aria-label="Abrir menú de navegación"
            >
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-cream transition-colors hover:border-gold hover:bg-gold/10"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm border-l border-gold/15 bg-ink p-0"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gold/10 p-6">
                  <SheetTitle asChild>
                    <div>
                      <Logo />
                    </div>
                  </SheetTitle>
                </div>
                <nav aria-label="Navegación móvil" className="flex-1 overflow-y-auto scroll-area-luxury p-6">
                  <ul className="space-y-2">
                    {NAV_LINKS.map((link, i) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            setMenuOpen(false);
                            navigate(link.href);
                          }}
                          className={cn(
                            "group flex items-baseline gap-4 rounded-2xl px-4 py-4 transition-colors hover:bg-gold/8",
                            route.view === link.view ? "text-gold" : "text-cream"
                          )}
                        >
                          <span className="font-jp text-xs text-gold/60">0{i + 1}</span>
                          <span className="font-display text-3xl font-medium">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 space-y-3 rounded-2xl border border-gold/12 bg-surface p-5 text-sm text-muted-foreground">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Visítanos</p>
                    <p>{SITE.address}</p>
                    <p>{SITE.city}</p>
                    <p className="text-cream">{SITE.phone}</p>
                  </div>
                </nav>
                <div className="border-t border-gold/10 p-6">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/carta");
                    }}
                    className="btn-gold flex h-12 w-full items-center justify-center rounded-full text-[13px] font-bold uppercase tracking-[0.18em]"
                  >
                    Ver la carta
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
