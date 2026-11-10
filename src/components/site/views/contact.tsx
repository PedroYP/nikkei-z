"use client";

/* ============================================================
   VISTA · CONTACTO · ubicación, horarios, FAQ, formulario
   ============================================================ */

import { useState } from "react";
import Image from "next/image";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { SITE } from "@/lib/data";
import { useViewFx } from "@/lib/anim";
import { CtaLink, Kicker, SectionHeading } from "@/components/site/ui-bits";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "¿A qué distritos llega el delivery?",
    a: `Llegamos a ${SITE.zones.join(", ")} y alrededores. El pedido mínimo es de S/ 26 y el delivery cuesta S/ 8 — gratis desde S/ 90 o en cualquier combo.`,
  },
  {
    q: "¿Cuánto demora el delivery?",
    a: "Nuestro promedio es de 25 a 35 minutos dentro de la zona núcleo (Miraflores, San Isidro, Barranco). En horas pico (viernes y sábado de 20:00 a 22:00) puede demorar hasta 45 minutos.",
  },
  {
    q: "¿Puedo pedir sin picante o con adaptaciones?",
    a: "Siempre. Escribe en las notas de tu pedido “sin picante”, “sin wasabi”, “extra kion” o lo que necesites. La mayoría de rolls se adapta sin costo y sin drama.",
  },
  {
    q: "¿Hacen eventos y catering?",
    a: "Sí — desde 20 personas armamos barras de maki en vivo con nuestro chef. Escríbenos por WhatsApp con al menos 5 días de anticipación y te mandamos una propuesta.",
  },
  {
    q: "¿Aceptan reservas en el local?",
    a: "Tenemos 6 mesas en el bar y se reservan por WhatsApp con 24 horas de anticipación. Los viernes y sábado recomendamos reservar temprano: se llenan.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Yape, Plin, tarjetas de crédito/débito (link seguro) y efectivo contra entrega. En el local además aceptamos todas las tarjetas en terminal.",
  },
];

export default function ContactView() {
  const rootRef = useViewFx<HTMLElement>();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "¿Tu nombre?";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Necesitamos un correo real para responderte.";
    if (form.message.trim().length < 10) errs.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({
        title: "Mensaje en el horno ✦",
        description: "Respondemos en menos de 24 horas hábiles. Gracias por escribirnos.",
      });
      setForm({ name: "", email: "", message: "" });
    }, 900);
  };

  const inputCls = (hasError: boolean) =>
    cn(
      "h-12 w-full rounded-2xl border bg-surface px-4 text-sm text-cream placeholder:text-muted-foreground/50 focus:outline-none",
      hasError ? "border-ember" : "border-gold/20 focus:border-gold"
    );

  return (
    <div ref={rootRef} className="flex flex-col">
      {/* ==================== HÉROE ==================== */}
      <section aria-labelledby="contacto-title" className="relative overflow-hidden pt-32 pb-14 lg:pt-40">
        <span
          aria-hidden="true"
          className="font-jp pointer-events-none absolute top-16 right-4 text-[20vw] leading-none font-semibold text-gold/[0.05] lg:text-[13rem]"
        >
          場所
        </span>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Kicker>Contacto · 場所</Kicker>
          <h1
            data-split
            className="mt-6 max-w-3xl font-display text-5xl leading-[0.98] font-medium text-cream sm:text-7xl"
          >
            Ven por el maki, <em className="text-gold-gradient font-light italic">quédate por la casa</em>
          </h1>
          <p data-reveal="up" className="mt-7 max-w-xl text-base leading-relaxed text-cream/75">
            Un bar de ocho metros en Miraflores con luz cálida, madera oscura y la
            cocina a la vista. También respondemos a la velocidad de un maki:
            WhatsApp es lo más rápido.
          </p>
        </div>
      </section>

      {/* ==================== INFO + MAPA ==================== */}
      <section aria-labelledby="visitanos-title" className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Dirección */}
          <div data-reveal="up" className="rounded-[2rem] border border-gold/12 bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-medium text-cream">El bar</h2>
            <address className="mt-3 text-sm leading-relaxed text-muted-foreground not-italic">
              {SITE.address}
              <br />
              {SITE.city}
            </address>
            <a
              href="https://maps.google.com/?q=Av.+Diagonal+518,+Miraflores,+Lima"
              target="_blank"
              rel="noreferrer"
              className="link-underline mt-4 inline-block text-sm font-semibold text-gold"
            >
              Cómo llegar →
            </a>
          </div>

          {/* Horario */}
          <div data-reveal="up" data-reveal-delay="0.08" className="rounded-[2rem] border border-gold/12 bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-medium text-cream">Horario</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4 text-muted-foreground">
                  <span>{h.days}</span>
                  <span className="text-cream/90">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto directo */}
          <div data-reveal="up" data-reveal-delay="0.16" className="rounded-[2rem] border border-gold/12 bg-surface p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-medium text-cream">Directo al chef</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-cream/85 transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                  {SITE.phone} · WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
                hola@sumi.pe
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram de SUMI"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-cream/70 transition-all hover:border-gold hover:text-gold"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook de SUMI"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-cream/70 transition-all hover:border-gold hover:text-gold"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Imagen de Lima + zonas */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div data-reveal="up" className="relative min-h-72 overflow-hidden rounded-[2rem]">
            <Image
              src="/images/story/lima.jpg"
              alt="Malecón de Miraflores, Lima, al atardecer — casa de SUMI"
              fill
              data-parallax="0.1"
              sizes="(max-width: 1024px) 92vw, 58vw"
              className="scale-[1.2] object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 font-display text-2xl text-cream italic">
              Miraflores, Lima — a 600 m del malecón
            </p>
          </div>
          <div data-reveal="up" data-reveal-delay="0.1" className="rounded-[2rem] border border-gold/12 bg-surface p-8">
            <h2 className="font-display text-2xl font-medium text-cream">Zonas de delivery</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {SITE.zones.map((z) => (
                <span key={z} className="rounded-full border border-gold/20 px-4 py-2 text-xs font-semibold text-cream/85">
                  {z}
                </span>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Delivery S/ 8 · gratis desde S/ 90 o con cualquier combo. Fuera de
              zona: escríbenos, si está a menos de 20 min en moto, llegamos.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== FAQ + FORMULARIO ==================== */}
      <section
        aria-labelledby="faq-title"
        className="border-y border-gold/12 bg-surface py-24 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          {/* FAQ */}
          <div>
            <SectionHeading kicker="Preguntas frecuentes" title="Lo que siempre" italic="nos preguntan" />
            <Accordion type="single" collapsible className="mt-10">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-gold/12">
                  <AccordionTrigger className="text-left text-base font-semibold text-cream hover:text-gold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Formulario */}
          <div data-reveal="right">
            <SectionHeading kicker="Escríbenos" title="¿Algo más" italic="que queramos saber?" />
            <form onSubmit={onSend} noValidate className="mt-10 space-y-5 rounded-[2rem] border border-gold/12 bg-ink/60 p-7 sm:p-8">
              <div>
                <label htmlFor="ct-name" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Nombre *
                </label>
                <input
                  id="ct-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-ct-name" : undefined}
                  className={inputCls(!!errors.name)}
                  placeholder="Tu nombre"
                />
                {errors.name ? (
                  <p id="err-ct-name" role="alert" className="mt-2 text-xs text-ember">{errors.name}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="ct-email" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Correo *
                </label>
                <input
                  id="ct-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-ct-email" : undefined}
                  className={inputCls(!!errors.email)}
                  placeholder="tucorreo@lima.pe"
                />
                {errors.email ? (
                  <p id="err-ct-email" role="alert" className="mt-2 text-xs text-ember">{errors.email}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="ct-msg" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Mensaje *
                </label>
                <textarea
                  id="ct-msg"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "err-ct-msg" : undefined}
                  className={cn(
                    "w-full resize-none rounded-2xl border bg-surface px-4 py-3 text-sm text-cream placeholder:text-muted-foreground/50 focus:outline-none",
                    errors.message ? "border-ember" : "border-gold/20 focus:border-gold"
                  )}
                  placeholder="Eventos, catering, reservas o simplemente decirnos que el furikake está increíble…"
                />
                {errors.message ? (
                  <p id="err-ct-msg" role="alert" className="mt-2 text-xs text-ember">{errors.message}</p>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="btn-gold flex h-13 w-full items-center justify-center gap-2 rounded-full text-[13px] font-bold uppercase tracking-[0.2em] disabled:cursor-wait disabled:opacity-70"
              >
                {sending ? "Enviando…" : (
                  <>
                    Enviar mensaje <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section aria-labelledby="contacto-cta" className="relative overflow-hidden py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <h2 id="contacto-cta" data-split className="font-display text-4xl leading-[1.05] font-medium text-cream sm:text-6xl">
            Más rápido por <em className="text-gold-gradient font-light italic">WhatsApp</em>
          </h2>
          <p data-reveal="up" className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
            Respondemos en minutos dentro del horario de atención. Pedidos,
            reservas, eventos o el clásico “¿ya llegó mi maki?”.
          </p>
          <div data-reveal="up" data-reveal-delay="0.1" className="mt-9">
            <CtaLink
              href={`https://wa.me/${SITE.whatsapp}?text=Hola%20SUMI%20%E2%9C%A6`}
              ariaLabel="Abrir chat de WhatsApp con SUMI"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> Escribir ahora
            </CtaLink>
          </div>
        </div>
      </section>
    </div>
  );
}
