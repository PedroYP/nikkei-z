"use client";

/* ============================================================
   Footer · sticky bottom (min-h-screen flex en el AppShell)
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import { Clock, Instagram, Facebook, MapPin, Phone, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/lib/router";
import { SITE } from "@/lib/data";
import { Logo } from "@/components/site/navbar";

export default function Footer() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Correo inválido",
        description: "Escribe un correo real y te avisamos de los lanzamientos.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Bienvenido a la mesa de SUMI ✦",
      description: "Te avisaremos primero de cada maki nuevo y de las ofertas de la casa.",
    });
    setEmail("");
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-gold/12 bg-[#080706]">
      {/* Palabra gigante de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 font-jp text-[26vw] leading-none font-semibold text-outline opacity-60 select-none"
      >
        巻
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Marca */}
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Makis de autor con técnica japonesa y alma nikkei. Arroz en punto,
              pescado del día del terminal de Surquillo y salsas que Lima adoptó como propias.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram de SUMI"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-cream/70 transition-all hover:border-gold hover:bg-gold/10 hover:text-gold"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook de SUMI"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-cream/70 transition-all hover:border-gold hover:bg-gold/10 hover:text-gold"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp de SUMI"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-cream/70 transition-all hover:border-gold hover:bg-gold/10 hover:text-gold"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <nav aria-label="Enlaces del pie de página">
            <p className="badge-luxury text-gold">Navega</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { href: "/", label: "Inicio" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/carta", label: "La Carta" },
                { href: "/carrito", label: "Carrito" },
                { href: "/contacto", label: "Contacto" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(l.href);
                    }}
                    className="link-underline text-cream/75 transition-colors hover:text-cream"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Horario */}
          <div>
            <p className="badge-luxury text-gold">Horario</p>
            <ul className="mt-5 space-y-3 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.days} className="flex items-start gap-3 text-cream/75">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" aria-hidden="true" />
                  <span>
                    <span className="block">{h.days}</span>
                    <span className="block text-muted-foreground">{h.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="badge-luxury text-gold">La mesa VIP</p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Suscríbete y recibe antes que nadie los makis de temporada y
              códigos de descuento de la casa.
            </p>
            <form onSubmit={onSubscribe} className="mt-5 flex gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@lima.pe"
                autoComplete="email"
                className="h-11 min-w-0 flex-1 rounded-full border border-gold/20 bg-surface px-4 text-sm text-cream placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Suscribirme al boletín"
                className="btn-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
              {SITE.address}, {SITE.city}
            </p>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-gold/10 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SUMI Maki & Nikkei Bar — Lima, Perú. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="rounded-full border border-gold/20 px-3 py-1.5">Yape</span>
            <span className="rounded-full border border-gold/20 px-3 py-1.5">Plin</span>
            <span className="rounded-full border border-gold/20 px-3 py-1.5">Visa</span>
            <span className="rounded-full border border-gold/20 px-3 py-1.5">Efectivo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
