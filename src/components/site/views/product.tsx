"use client";

/* ============================================================
   VISTA · PRODUCTO · detalle + relacionados
   ============================================================ */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { getProduct, PRODUCTS, formatPrice, CATEGORIES } from "@/lib/data";
import { useCart } from "@/lib/cart-store";
import { useRouter } from "@/lib/router";
import { useViewFx } from "@/lib/anim";
import { ProductBadge, SpiceMeter, Stars, CtaLink } from "@/components/site/ui-bits";
import ProductCard from "@/components/site/product-card";

export default function ProductView({ slug }: { slug: string }) {
  const rootRef = useViewFx<HTMLElement>();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);
  const { navigate } = useRouter();

  const product = getProduct(slug);

  if (!product) {
    return (
      <div className="flex min-h-[70svh] flex-col items-center justify-center gap-6 px-6 pt-28 text-center">
        <span className="font-jp text-6xl text-gold/60">不在</span>
        <h1 className="font-display text-4xl text-cream">Ese maki no está en la carta</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Quizá fue retirado o el enlace cambió. La carta completa sigue aquí abajo.
        </p>
        <CtaLink href="/carta">Volver a la carta</CtaLink>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === product.category);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  )
    .concat(PRODUCTS.filter((p) => p.slug !== product.slug && p.featured))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 3);

  const onAdd = () => {
    add(product.slug, qty);
    setAdded(true);
    openCart();
    toast({
      title: `${product.name} ×${qty} al carrito ✦`,
      description: `${product.pieces * qty} piezas en camino a tu pedido.`,
    });
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-7xl px-5 pt-28 pb-24 sm:px-8 lg:pt-36">
      {/* Migas de pan */}
      <nav aria-label="Miga de pan" data-reveal="up">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <li>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="transition-colors hover:text-gold"
            >
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3 w-3" />
          </li>
          <li>
            <Link
              href="/carta"
              onClick={(e) => {
                e.preventDefault();
                navigate("/carta");
              }}
              className="transition-colors hover:text-gold"
            >
              La Carta
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3 w-3" />
          </li>
          <li aria-current="page" className="text-gold">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Imagen */}
        <div data-reveal="left" className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-gold/15">
            <Image
              src={product.image}
              alt={`${product.name} — ${product.pieces} piezas, ${category?.label}`}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            <div className="absolute top-5 left-5 flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <ProductBadge key={b} badge={b} />
              ))}
            </div>
          </div>
          <p className="mt-4 text-center font-jp text-sm tracking-[0.4em] text-gold/50">
            {product.jp}
          </p>
        </div>

        {/* Detalle */}
        <div>
          <p data-reveal="up" className="badge-luxury text-gold">
            {category?.label} · {product.pieces} piezas
          </p>
          <h1
            data-split
            className="mt-4 font-display text-5xl leading-[0.98] font-medium text-cream sm:text-6xl"
          >
            {product.name}
          </h1>

          <div data-reveal="up" className="mt-5 flex flex-wrap items-center gap-4">
            <Stars rating={product.rating} />
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} / 5
            </span>
            <SpiceMeter level={product.spice} />
            {product.spice > 0 ? (
              <span className="text-xs text-muted-foreground">
                {["", "suave", "medio", "valiente"][product.spice]}
              </span>
            ) : null}
          </div>

          <p data-reveal="up" className="mt-7 text-base leading-relaxed text-cream/80">
            {product.description}
          </p>

          {/* Ingredientes */}
          <div data-reveal="up" className="mt-8">
            <p className="badge-luxury text-muted-foreground">Dentro del roll</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="rounded-full border border-gold/20 bg-surface px-4 py-2 text-xs font-semibold text-cream/85"
                >
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Precio + cantidad */}
          <div
            data-reveal="up"
            className="mt-10 rounded-[2rem] border border-gold/15 bg-surface p-6 sm:p-7"
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl font-semibold text-gold">
                    {formatPrice(product.price * qty)}
                  </span>
                  {product.oldPrice ? (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.oldPrice * qty)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.pieces} piezas por unidad · {product.pieces * qty} en total
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-1 rounded-full border border-gold/25 p-1.5">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Quitar una unidad"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-cream transition-colors hover:bg-gold/15"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="w-10 text-center font-display text-xl font-semibold text-cream" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(30, qty + 1))}
                  aria-label="Añadir una unidad"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-cream transition-colors hover:bg-gold/15"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onAdd}
              aria-label={`Añadir ${qty} × ${product.name} al carrito`}
              className="btn-gold mt-6 flex h-14 w-full items-center justify-center rounded-full text-[13px] font-bold uppercase tracking-[0.2em]"
            >
              {added ? (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" aria-hidden="true" /> Agregado al carrito
                </span>
              ) : (
                `Añadir al carrito · ${formatPrice(product.price * qty)}`
              )}
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Delivery gratis desde S/ 90 · llegada estimada 25–35 min
            </p>
          </div>

          {/* Acordeón de detalles */}
          <div data-reveal="up" className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="conservacion" className="border-gold/12">
                <AccordionTrigger className="text-left font-display text-xl text-cream hover:text-gold hover:no-underline">
                  Conservación y consumo
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Consérvalo refrigerado a máx. 4°C y consúmelo dentro de las 4 horas
                  siguientes a la entrega para vivirlo en su punto exacto. El arroz
                  llega tibio (36°C): si lo prefieres a temperatura ambiente, déjalo
                  5 minutos antes de abrir la caja.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="alergenos" className="border-gold/12">
                <AccordionTrigger className="text-left font-display text-xl text-cream hover:text-gold hover:no-underline">
                  Alérgenos
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Contiene pescado, sésamo y derivados de soya. Algunas salsas llevan
                  mayonesa (huevo). Si tienes alergia específica, escríbenos por
                  WhatsApp antes de ordenar: adaptamos la mayoría de rolls.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="picante" className="border-gold/12">
                <AccordionTrigger className="text-left font-display text-xl text-cream hover:text-gold hover:no-underline">
                  Nivel de picante
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Nuestro picante viene del ají limo fresco y de la crema acebichada.
                  Puedes pedirlo “sin picante” o “extra picante” (nivel 🌶️🌶️🌶️,
                  solo para valientes) sin costo adicional.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      <section aria-labelledby="relacionados" className="mt-24 border-t border-gold/10 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="relacionados" className="font-display text-4xl font-medium text-cream sm:text-5xl">
            Pide también <em className="text-gold-gradient font-light italic">por ahí</em>
          </h2>
          <CtaLink href="/carta" variant="ghost" className="!px-6 !py-2.5 text-[11px]">
            Toda la carta
          </CtaLink>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <div key={p.slug} data-reveal="up" data-reveal-delay={String(i * 0.08)}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
