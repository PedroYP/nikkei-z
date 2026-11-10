"use client";

/* ============================================================
   ProductCard · imagen con zoom, badges, precio, add-to-cart
   ============================================================ */

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-store";
import { useRouter } from "@/lib/router";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { ProductBadge, SpiceMeter, Stars } from "@/components/site/ui-bits";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);
  const { navigate } = useRouter();

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug);
    toast({
      title: `${product.name} al carrito ✦`,
      description: `${product.pieces} piezas listas para el viaje.`,
    });
    openCart();
  };

  return (
    <article className="product-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gold/10 bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/35 hover:shadow-[0_24px_60px_-20px_rgba(201,162,75,0.25)]">
      <Link
        href={`/producto/${product.slug}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/producto/${product.slug}`);
        }}
        className="flex h-full flex-col"
        aria-label={`Ver detalle de ${product.name}`}
      >
        {/* Media */}
        <div className="product-card-media relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={`${product.name} — ${product.pieces} piezas`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
          />
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <ProductBadge key={b} badge={b} />
            ))}
          </div>
          {product.oldPrice ? (
            <span className="badge-luxury absolute top-4 right-4 rounded-full bg-ink/85 px-3 py-1.5 text-gold backdrop-blur">
              −{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          ) : null}
          <span className="absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1 font-jp text-[11px] tracking-widest text-gold/90 backdrop-blur">
            {product.jp}
          </span>
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl leading-tight font-medium text-cream transition-colors group-hover:text-gold-light">
              {product.name}
            </h3>
            <span className="jp-count shrink-0 text-[11px] font-semibold tracking-wider text-muted-foreground">
              ×{product.pieces}
            </span>
          </div>

          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating} />
            <SpiceMeter level={product.spice} />
          </div>

          <div className="mt-auto flex items-end justify-between pt-5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[26px] leading-none font-semibold text-gold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Añadir ${product.name} al carrito`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold transition-all duration-300 hover:scale-105 hover:border-gold hover:bg-gold hover:text-ink active:scale-95"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}
