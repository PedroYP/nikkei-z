"use client";

/* ============================================================
   CartDrawer · lateral derecho, feedback inmediato
   ============================================================ */

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart, cartSubtotal } from "@/lib/cart-store";
import { useRouter } from "@/lib/router";
import { PRODUCTS, SITE, formatPrice } from "@/lib/data";

export default function CartDrawer() {
  const isCartOpen = useCart((s) => s.isCartOpen);
  const closeCart = useCart((s) => s.closeCart);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const items = useCart((s) => s.items);
  const { navigate } = useRouter();

  const detailed = items
    .map((i) => ({ ...i, product: PRODUCTS.find((p) => p.slug === i.slug) }))
    .filter((i) => i.product);

  const subtotal = cartSubtotal(items);
  const missingForFree = Math.max(0, SITE.freeDeliveryFrom - subtotal);

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? null : closeCart())}>
      <SheetContent
        side="right"
        className="flex w-[92vw] max-w-md flex-col gap-0 border-l border-gold/15 bg-ink p-0"
      >
        <SheetHeader className="border-b border-gold/10 p-6">
          <SheetTitle className="flex items-center justify-between font-display text-2xl font-medium text-cream">
            Tu pedido
            <span className="font-jp text-sm text-gold/70">お願い</span>
          </SheetTitle>
        </SheetHeader>

        {detailed.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
            <span className="enso flex h-24 w-24 items-center justify-center">
              <ShoppingBag className="h-9 w-9 text-gold" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-2xl text-cream">Tu carrito está en ayunas</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Un acevichado recién sellado arregla eso.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                closeCart();
                navigate("/carta");
              }}
              className="btn-gold mt-2 flex h-11 items-center rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.18em]"
            >
              Ver la carta
            </button>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div className="scroll-area-luxury max-h-[46vh] flex-1 overflow-y-auto p-4">
              <ul className="space-y-3">
                {detailed.map(({ product, qty }) => (
                  <li
                    key={product!.slug}
                    className="flex gap-4 rounded-2xl border border-gold/10 bg-surface p-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={product!.image}
                        alt={product!.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg leading-tight text-cream">
                            {product!.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product!.pieces} piezas · {formatPrice(product!.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(product!.slug)}
                          aria-label={`Quitar ${product!.name} del carrito`}
                          className="text-muted-foreground transition-colors hover:text-ember"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 rounded-full border border-gold/20 p-1">
                          <button
                            type="button"
                            onClick={() => setQty(product!.slug, qty - 1)}
                            aria-label={`Quitar una unidad de ${product!.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-cream transition-colors hover:bg-gold/15"
                          >
                            <Minus className="h-3 w-3" aria-hidden="true" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-cream" aria-live="polite">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(product!.slug, qty + 1)}
                            aria-label={`Añadir una unidad de ${product!.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-cream transition-colors hover:bg-gold/15"
                          >
                            <Plus className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </div>
                        <p className="font-display text-lg font-semibold text-gold">
                          {formatPrice(product!.price * qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resumen */}
            <div className="border-t border-gold/10 p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-cream">{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-muted-foreground">
                  {missingForFree > 0 ? `${formatPrice(SITE.deliveryFee)} · gratis desde S/ ${SITE.freeDeliveryFrom}` : "Gratis ✦"}
                </span>
              </div>
              {missingForFree > 0 ? (
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-gold/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-700"
                    style={{ width: `${Math.min(100, (subtotal / SITE.freeDeliveryFrom) * 100)}%` }}
                  />
                </div>
              ) : null}
              <div className="mt-5 flex items-baseline justify-between border-t border-gold/10 pt-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  Total
                </span>
                <span className="font-display text-3xl font-semibold text-gold">
                  {formatPrice(subtotal + (missingForFree > 0 ? SITE.deliveryFee : 0))}
                </span>
              </div>
              <Link
                href="/carrito"
                onClick={(e) => {
                  e.preventDefault();
                  closeCart();
                  navigate("/carrito");
                }}
                className="btn-gold mt-5 flex h-12 w-full items-center justify-center rounded-full text-[13px] font-bold uppercase tracking-[0.18em]"
              >
                Finalizar pedido
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-cream hover:underline"
              >
                Seguir mirando la carta
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
