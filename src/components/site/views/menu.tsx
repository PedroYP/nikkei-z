"use client";

/* ============================================================
   VISTA · CARTA · filtros por categoría + grid completo
   ============================================================ */

import { useState } from "react";
import { Leaf, Search, UtensilsCrossed } from "lucide-react";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/data";
import { useViewFx } from "@/lib/anim";
import { Kicker, SectionHeading } from "@/components/site/ui-bits";
import ProductCard from "@/components/site/product-card";
import { cn } from "@/lib/utils";

type Filter = CategoryId | "todos";

export default function MenuView() {
  const rootRef = useViewFx<HTMLElement>();
  const [filter, setFilter] = useState<Filter>("todos");

  const visibleCategories = CATEGORIES.filter(
    (c) => filter === "todos" || c.id === filter
  );

  const list =
    filter === "todos" ? visibleCategories : visibleCategories;

  const countFor = (id: Filter) =>
    id === "todos" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === id).length;

  return (
    <div ref={rootRef} className="flex flex-col">
      {/* ==================== HÉROE DE CARTA ==================== */}
      <section aria-labelledby="carta-title" className="relative overflow-hidden pt-32 pb-12 lg:pt-40">
        <span
          aria-hidden="true"
          className="font-jp pointer-events-none absolute top-16 right-4 text-[20vw] leading-none font-semibold text-gold/[0.05] lg:text-[13rem]"
        >
          全巻
        </span>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Kicker>La carta · お品書き</Kicker>
          <h1
            data-split
            className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] font-medium text-cream sm:text-7xl"
          >
            Todo se enrolla <em className="text-gold-gradient font-light italic">al momento</em>
          </h1>
          <p data-reveal="up" className="mt-7 max-w-xl text-base leading-relaxed text-cream/75">
            {PRODUCTS.length} creaciones entre clásicos, furikake crocantes y rolls
            de autor. Ninguna pieza se prepara antes de tu pedido.
          </p>
          <div data-reveal="up" className="mt-8 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2">
              <Leaf className="h-3.5 w-3.5 text-jade" aria-hidden="true" /> Opciones veggie
            </span>
            <span className="flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2">
              <Search className="h-3.5 w-3.5 text-gold/80" aria-hidden="true" /> Pescado del día
            </span>
            <span className="flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2">
              <UtensilsCrossed className="h-3.5 w-3.5 text-ember" aria-hidden="true" /> Picante configurable
            </span>
          </div>
        </div>
      </section>

      {/* ==================== FILTROS STICKY ==================== */}
      <div className="sticky top-16 z-40 border-y border-gold/12 bg-ink/90 backdrop-blur-xl lg:top-[74px]">
        <div
          role="tablist"
          aria-label="Filtrar la carta por categoría"
          className="h-scroll mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 sm:px-8"
        >
          {[{ id: "todos" as Filter, label: "Todo", jp: "全" }, ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.label, jp: c.jp }))].map(
            (c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-2.5 text-[12px] font-bold tracking-wide uppercase transition-all duration-300",
                  filter === c.id
                    ? "border-gold bg-gold text-ink"
                    : "border-gold/20 text-cream/70 hover:border-gold/50 hover:text-cream"
                )}
              >
                <span aria-hidden="true" className={cn("font-jp text-[11px] normal-case", filter === c.id ? "text-ink/70" : "text-gold/60")}>
                  {c.jp}
                </span>
                {c.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px]",
                    filter === c.id ? "bg-ink/15 text-ink" : "bg-gold/10 text-gold"
                  )}
                >
                  {countFor(c.id)}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* ==================== GRID POR CATEGORÍA ==================== */}
      <div key={filter} className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {list.map((cat, idx) => {
          const items = PRODUCTS.filter((p) => p.category === cat.id);
          if (!items.length) return null;
          return (
            <section
              key={cat.id}
              aria-labelledby={`cat-${cat.id}`}
              className={cn("py-14 lg:py-16", idx > 0 && "border-t border-gold/10")}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 id={`cat-${cat.id}`} className="font-display text-4xl font-medium text-cream sm:text-5xl">
                  {cat.label}
                  <span aria-hidden="true" className="ml-4 font-jp text-xl text-gold/60">
                    {cat.jp}
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground italic">{cat.description}</p>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <div
                    key={p.slug}
                    data-reveal="up"
                    data-reveal-delay={String((i % 3) * 0.08)}
                  >
                    <ProductCard product={p} priority={i === 0 && idx === 0} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Nota al pie de la carta */}
        <aside
          data-reveal="up"
          className="mb-20 rounded-[2rem] border border-gold/15 bg-surface p-8 sm:p-10"
        >
          <h2 className="font-display text-2xl font-medium text-cream">
            Bueno saberlo <span className="font-jp text-base text-gold/70">メモ</span>
          </h2>
          <ul className="mt-5 grid gap-4 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-gold">✦</span>
              Todos los rolls llevan wasabi, kion y salsa de la casa. Puedes pedir
              “sin wasabi” y “sin picante” al momento de ordenar.
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-gold">✦</span>
              Contienen pescado crudo: no recomendados para embarazadas o
              inmunosuprimidos. Pregunta por nuestras versiones cocidas.
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-gold">✦</span>
              Precios en soles, incluyen IGV. Delivery S/ 8 · gratis desde
              S/ 90 en toda Lima Metropolitana.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
