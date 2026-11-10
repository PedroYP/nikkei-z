"use client";

/* ============================================================
   Piezas UI de autor · marquesinas, botones magnéticos,
   encabezados de sección, estrellas, picante
   ============================================================ */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Flame, Star } from "lucide-react";
import { gsap, prefersReduced } from "@/lib/anim";
import { cn } from "@/lib/utils";

/* ---------- Kicker (etiqueta superior de sección) ---------- */
export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-gold",
        className
      )}
    >
      <span aria-hidden="true" className="inline-block h-px w-8 bg-gold/60" />
      {children}
    </p>
  );
}

/* ---------- Encabezado de sección ---------- */
export function SectionHeading({
  kicker,
  title,
  italic,
  description,
  align = "left",
  className,
}: {
  kicker: string;
  title: string;
  italic?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Kicker className={align === "center" ? "justify-center" : ""}>{kicker}</Kicker>
      <h2
        data-split
        className="mt-5 font-display text-4xl leading-[1.05] font-medium text-cream sm:text-5xl lg:text-6xl"
      >
        {title}
        {italic ? (
          <>
            {" "}
            <em className="text-gold-gradient font-light italic">{italic}</em>
          </>
        ) : null}
      </h2>
      {description ? (
        <p data-reveal="up" className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Botón magnético (Mandel: feedback continuo) ---------- */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className="inline-block will-change-transform">
      {children}
    </div>
  );
}

/* ---------- CTA dorado como enlace interno ---------- */
export function CtaLink({
  href,
  children,
  variant = "gold",
  className,
  onClick,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "ghost";
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]",
        variant === "gold" ? "btn-gold" : "btn-ghost",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Link>
  );
}

/* ---------- Marquesina infinita ---------- */
export function Marquee({
  items,
  reverse = false,
  className,
  speed = 38,
  withStar = true,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  speed?: number;
  withStar?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={cn("marquee-paused relative overflow-hidden select-none", className)}
      aria-hidden="true"
    >
      <div
        className={cn("marquee-track", reverse && "reverse")}
        style={{ ["--marquee-speed" as string]: `${speed}s` }}
      >
        {row.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="px-6 font-display text-2xl font-light tracking-wide text-cream/70 italic sm:text-3xl">
              {item}
            </span>
            {withStar ? <span className="text-gold">✦</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Estrellas de rating ---------- */
export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("h-3.5 w-3.5", i < Math.round(rating) ? "fill-gold text-gold" : "text-muted-foreground/30")}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/* ---------- Medidor de picante ---------- */
export function SpiceMeter({ level, className }: { level: number; className?: string }) {
  if (level <= 0) return null;
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`Nivel de picante: ${level} de 3`}
      title={`Picante ${level}/3`}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame
          key={i}
          aria-hidden="true"
          className={cn("h-3.5 w-3.5", i < level ? "fill-ember text-ember" : "text-muted-foreground/25")}
        />
      ))}
    </span>
  );
}

/* ---------- Badge de producto ---------- */
const BADGE_STYLES: Record<string, string> = {
  bestseller: "bg-gold text-ink",
  nuevo: "bg-ember text-ink",
  veggie: "bg-jade text-ink",
  picante: "border border-ember/60 text-ember bg-transparent",
};
const BADGE_LABELS: Record<string, string> = {
  bestseller: "Top ventas",
  nuevo: "Nuevo",
  veggie: "Veggie",
  picante: "Picante",
};

export function ProductBadge({ badge }: { badge: string }) {
  return (
    <span className={cn("badge-luxury rounded-full px-3 py-1.5", BADGE_STYLES[badge])}>
      {BADGE_LABELS[badge]}
    </span>
  );
}
