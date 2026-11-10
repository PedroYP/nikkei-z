"use client";

/* ============================================================
   VISTA · CARRITO + CHECKOUT · flujo completo de pedido
   ============================================================ */

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  Bike,
  Check,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Smartphone,
  Store,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PRODUCTS, SITE, formatPrice } from "@/lib/data";
import { useCart, cartSubtotal, type PaymentMethod, type DeliveryMode } from "@/lib/cart-store";
import { useRouter } from "@/lib/router";
import { useViewFx } from "@/lib/anim";
import { CtaLink } from "@/components/site/ui-bits";
import { cn } from "@/lib/utils";

const PAYMENTS: Array<{ id: PaymentMethod; label: string; hint: string; icon: typeof Smartphone }> = [
  { id: "yape", label: "Yape / Plin", hint: "Confirmas al recibir el QR", icon: Smartphone },
  { id: "tarjeta", label: "Tarjeta", hint: "Link seguro de pago", icon: CreditCard },
  { id: "efectivo", label: "Efectivo", hint: "Pago contra entrega", icon: Banknote },
];

export default function CartView() {
  const rootRef = useViewFx<HTMLElement>();
  const { navigate } = useRouter();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const deliveryMode = useCart((s) => s.deliveryMode);
  const setDeliveryMode = useCart((s) => s.setDeliveryMode);
  const paymentMethod = useCart((s) => s.paymentMethod);
  const setPaymentMethod = useCart((s) => s.setPaymentMethod);

  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const detailed = items
    .map((i) => ({ ...i, product: PRODUCTS.find((p) => p.slug === i.slug) }))
    .filter((i) => i.product);

  const subtotal = cartSubtotal(items);
  const hasCombo = useMemo(
    () => detailed.some((d) => d.product!.category === "combo"),
    [detailed]
  );
  const deliveryFee =
    deliveryMode === "pickup" || subtotal >= SITE.freeDeliveryFrom || hasCombo
      ? 0
      : SITE.deliveryFee;
  const total = subtotal + deliveryFee;

  /* ---------- Validación ---------- */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Escribe tu nombre completo.";
    if (!/^9\d{8}$/.test(form.phone.trim()))
      e.phone = "Ingresa un celular válido de 9 dígitos que empiece en 9.";
    if (deliveryMode === "delivery" && form.address.trim().length < 8)
      e.address = "Necesitamos una dirección con más detalle (calle y número).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- Continuar el pedido por WhatsApp ---------- */
  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast({
        title: "Revisa los datos marcados",
        description: "Falta poco: hay campos por completar.",
        variant: "destructive",
      });
      return;
    }
    const orderLines = detailed.map(({ product, qty }) => `• ${qty} × ${product!.name} — ${formatPrice(product!.price * qty)}`);
    const message = [
      `Hola SUMI, quisiera hacer un pedido a nombre de ${form.name.trim()}.`,
      `Celular: ${form.phone.trim()}`,
      `Modalidad: ${deliveryMode === "delivery" ? "Delivery" : "Recojo en tienda"}`,
      ...(deliveryMode === "delivery" ? [`Dirección: ${form.address.trim()}`] : []),
      "",
      ...orderLines,
      `Total estimado: ${formatPrice(total)}`,
      `Pago preferido: ${PAYMENTS.find((p) => p.id === paymentMethod)?.label ?? paymentMethod}`,
      ...(form.notes.trim() ? [`Notas: ${form.notes.trim()}`] : []),
    ].join("\n");
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    toast({
      title: "Revisa tu mensaje en WhatsApp",
      description: "El pedido aún no se ha enviado. Confírmalo desde WhatsApp.",
    });
  };

  /* ==================== CARRITO VACÍO ==================== */
  if (detailed.length === 0) {
    const suggestions = PRODUCTS.filter((p) => p.featured).slice(0, 3);
    return (
      <div ref={rootRef} className="mx-auto w-full max-w-5xl px-5 pt-28 pb-24 sm:px-8">
        <div className="flex flex-col items-center gap-6 pt-16 text-center">
          <span className="enso flex h-28 w-28 items-center justify-center">
            <ShoppingBag className="h-11 w-11 text-gold" aria-hidden="true" />
          </span>
          <h1 className="font-display text-5xl font-medium text-cream sm:text-6xl">
            Tu carrito está <em className="text-gold-gradient font-light italic">en ayunas</em>
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Empieza por los más pedidos o entra directo a los combos: dos clics y
            estás comiendo.
          </p>
          <CtaLink href="/carta">Ver la carta</CtaLink>
        </div>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((p, i) => (
            <div key={p.slug} data-reveal="up" data-reveal-delay={String(i * 0.08)}>
              {/* Reutiliza tarjeta de producto */}
              <Link
                href={`/producto/${p.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/producto/${p.slug}`);
                }}
                className="group block overflow-hidden rounded-3xl border border-gold/10 bg-surface transition-colors hover:border-gold/30"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 90vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="font-display text-xl text-cream">{p.name}</p>
                  <p className="mt-1 text-sm text-gold">{formatPrice(p.price)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ==================== CARRITO + CHECKOUT ==================== */
  return (
    <div ref={rootRef} className="mx-auto w-full max-w-7xl px-5 pt-28 pb-24 sm:px-8 lg:pt-36">
      <p className="badge-luxury text-gold">Tu pedido · お願い</p>
      <h1 data-split className="mt-4 font-display text-5xl leading-tight font-medium text-cream sm:text-6xl">
        Casi listo para <em className="text-gold-gradient font-light italic">enrollarse</em>
      </h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        {/* Columna izquierda: items + datos */}
        <div className="space-y-10">
          {/* Items */}
          <section aria-label="Productos de tu pedido" data-reveal="up">
            <ul className="space-y-4">
              {detailed.map(({ product, qty }) => (
                <li
                  key={product!.slug}
                  className="flex flex-wrap items-center gap-5 rounded-3xl border border-gold/10 bg-surface p-4 sm:p-5"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
                    <Image
                      src={product!.image}
                      alt={product!.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-[150px] flex-1">
                    <Link
                      href={`/producto/${product!.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/producto/${product!.slug}`);
                      }}
                      className="font-display text-2xl text-cream transition-colors hover:text-gold"
                    >
                      {product!.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {product!.pieces} piezas · {formatPrice(product!.price)} c/u
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-gold/25 p-1">
                        <button
                          type="button"
                          onClick={() => setQty(product!.slug, qty - 1)}
                          aria-label={`Quitar una unidad de ${product!.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-cream transition-colors hover:bg-gold/15"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center font-semibold text-cream" aria-live="polite">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(product!.slug, qty + 1)}
                          aria-label={`Añadir una unidad de ${product!.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-cream transition-colors hover:bg-gold/15"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(product!.slug)}
                        aria-label={`Quitar ${product!.name} del carrito`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-ember/10 hover:text-ember"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <p className="ml-auto font-display text-2xl font-semibold text-gold">
                    {formatPrice(product!.price * qty)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Datos de entrega */}
          <section aria-labelledby="datos-entrega" data-reveal="up">
            <h2 id="datos-entrega" className="font-display text-3xl font-medium text-cream">
              ¿Cómo lo quieres?
            </h2>

            {/* Modo */}
            <fieldset className="mt-5">
              <legend className="sr-only">Modo de entrega</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { id: "delivery" as DeliveryMode, label: "Delivery", hint: "25–35 min · Lima", icon: Bike },
                    { id: "pickup" as DeliveryMode, label: "Recojo en tienda", hint: "Listo en 15 min", icon: Store },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={deliveryMode === opt.id}
                    onClick={() => setDeliveryMode(opt.id)}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
                      deliveryMode === opt.id
                        ? "border-gold bg-gold/10"
                        : "border-gold/15 bg-surface hover:border-gold/40"
                    )}
                  >
                    <opt.icon
                      className={cn("h-6 w-6 shrink-0", deliveryMode === opt.id ? "text-gold" : "text-muted-foreground")}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block font-semibold text-cream">{opt.label}</span>
                      <span className="block text-xs text-muted-foreground">{opt.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Form */}
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ck-name" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Nombre completo *
                  </label>
                  <input
                    id="ck-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    className={cn(
                      "h-12 w-full rounded-2xl border bg-surface px-4 text-sm text-cream placeholder:text-muted-foreground/50 focus:outline-none",
                      errors.name ? "border-ember" : "border-gold/20 focus:border-gold"
                    )}
                    placeholder="Ej. Valeria Contreras"
                  />
                  {errors.name ? (
                    <p id="err-name" role="alert" className="mt-2 text-xs text-ember">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="ck-phone" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Celular *
                  </label>
                  <input
                    id="ck-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 9) }))}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                    className={cn(
                      "h-12 w-full rounded-2xl border bg-surface px-4 text-sm text-cream placeholder:text-muted-foreground/50 focus:outline-none",
                      errors.phone ? "border-ember" : "border-gold/20 focus:border-gold"
                    )}
                    placeholder="987 654 321"
                  />
                  {errors.phone ? (
                    <p id="err-phone" role="alert" className="mt-2 text-xs text-ember">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              {deliveryMode === "delivery" ? (
                <div>
                  <label htmlFor="ck-address" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Dirección de entrega *
                  </label>
                  <input
                    id="ck-address"
                    type="text"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? "err-address" : undefined}
                    className={cn(
                      "h-12 w-full rounded-2xl border bg-surface px-4 text-sm text-cream placeholder:text-muted-foreground/50 focus:outline-none",
                      errors.address ? "border-ember" : "border-gold/20 focus:border-gold"
                    )}
                    placeholder="Ej. Av. Pardo 1287, dpto 402 — Miraflores"
                  />
                  {errors.address ? (
                    <p id="err-address" role="alert" className="mt-2 text-xs text-ember">
                      {errors.address}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="rounded-2xl border border-gold/15 bg-surface p-4 text-sm text-muted-foreground">
                  Recojo en <strong className="text-cream">{SITE.address}</strong> — te
                  avisamos por WhatsApp cuando esté listo (≈15 min).
                </p>
              )}

              <div>
                <label htmlFor="ck-notes" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Notas para la cocina
                </label>
                <textarea
                  id="ck-notes"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full resize-none rounded-2xl border border-gold/20 bg-surface px-4 py-3 text-sm text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none"
                  placeholder="Sin wasabi, extra jengibre, timbre no funciona…"
                />
              </div>

              {/* Pago */}
              <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Método de pago
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {PAYMENTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={paymentMethod === p.id}
                      onClick={() => setPaymentMethod(p.id)}
                      className={cn(
                        "flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-300",
                        paymentMethod === p.id
                          ? "border-gold bg-gold/10"
                          : "border-gold/15 bg-surface hover:border-gold/40"
                      )}
                    >
                      <p.icon
                        className={cn("h-5 w-5", paymentMethod === p.id ? "text-gold" : "text-muted-foreground")}
                        aria-hidden="true"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-cream">{p.label}</span>
                        <span className="block text-[11px] text-muted-foreground">{p.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            </form>
          </section>
        </div>

        {/* Columna derecha: resumen */}
        <aside data-reveal="right" className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-[2rem] border border-gold/15 bg-surface p-7 sm:p-8">
            <h2 className="font-display text-2xl font-medium text-cream">Resumen</h2>
            <dl className="mt-6 space-y-3.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Subtotal ({detailed.reduce((a, d) => a + d.qty, 0)} items)
                </dt>
                <dd className="font-semibold text-cream">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {deliveryMode === "pickup" ? "Recojo en tienda" : "Delivery"}
                </dt>
                <dd className={cn(deliveryFee === 0 ? "font-semibold text-jade" : "text-cream")}>
                  {deliveryFee === 0 ? "Gratis ✦" : formatPrice(deliveryFee)}
                </dd>
              </div>
              {hasCombo && deliveryMode === "delivery" ? (
                <p className="rounded-xl bg-gold/10 px-3 py-2 text-xs text-gold">
                  Los combos incluyen delivery gratis.
                </p>
              ) : null}
            </dl>
            <div className="mt-6 flex items-baseline justify-between border-t border-gold/12 pt-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Total
              </span>
              <span className="font-display text-4xl font-semibold text-gold">{formatPrice(total)}</span>
            </div>

            <button
              type="button"
              onClick={onSubmit}
              className="btn-gold mt-7 flex h-14 w-full items-center justify-center rounded-full text-[13px] font-bold uppercase tracking-[0.2em]"
            >
              Enviar pedido por WhatsApp · {formatPrice(total)}
            </button>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">
              Se abrirá WhatsApp con tu pedido preparado. El envío se confirma desde
              WhatsApp; el sitio no registra pedidos. Precios incluyen IGV.
            </p>
          </div>

          {/* Confianza */}
          <ul className="mt-6 space-y-3 text-xs text-muted-foreground">
            <li className="flex items-center gap-3 rounded-2xl border border-gold/10 bg-surface p-4">
              <Bike className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              Delivery propio con caja térmica — nada de terceros.
            </li>
            <li className="flex items-center gap-3 rounded-2xl border border-gold/10 bg-surface p-4">
              <Check className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              Si algo llega mal, lo reenvolvemos gratis. Palabra de la casa.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
