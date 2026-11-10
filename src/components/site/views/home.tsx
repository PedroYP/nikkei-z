"use client";

/* ============================================================
   VISTA · INICIO
   Hero 3D + scroll horizontal anclado + historia + ofertas
   ============================================================ */

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Bike,
  ChefHat,
  MousePointerClick,
  MoveRight,
  Quote,
} from "lucide-react";
import { PRODUCTS, STATS, TESTIMONIALS, SITE } from "@/lib/data";
import { assetPath } from "@/lib/assets";
import { useRouter } from "@/lib/router";
import {
  gsap,
  prefersReduced,
  onIntroDone,
  useViewFx,
} from "@/lib/anim";
import {
  CtaLink,
  Kicker,
  Magnetic,
  Marquee,
  SectionHeading,
  Stars,
} from "@/components/site/ui-bits";
import ProductCard from "@/components/site/product-card";

const Maki3D = dynamic(() => import("@/components/site/maki-3d"), {
  ssr: false,
});

const FEATURED = PRODUCTS.filter((p) => p.featured).slice(0, 6);
const COMBOS = PRODUCTS.filter((p) => p.category === "combo");

export default function HomeView() {
  const rootRef = useViewFx<HTMLElement>();
  const heroRef = useRef<HTMLElement>(null);
  const hSectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { navigate } = useRouter();

  /* ---------- Entrada del héroe (tras el preloader) ---------- */
  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    if (prefersReduced()) {
      gsap.set(root.querySelectorAll(".hero-el"), { opacity: 1 });
      return;
    }

    let alive = true;
    let tl: gsap.core.Timeline | null = null;

    /* Referencias directas: cuando play() se dispara desde el onComplete
       del preloader, GSAP restaura el _context activo y los selectores
       texto se resolverían contra el scope del preloader (bug). Con
       elementos resueltos aquí el tween es infalible. */
    const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
    const el = {
      canvas: q(".hero-canvas"),
      kicker: q(".hero-kicker"),
      lines: q(".hero-line-inner"),
      sub: q(".hero-sub"),
      ctas: q(".hero-cta > *"),
      meta: q(".hero-meta"),
      kanji: q(".hero-kanji"),
      scroll: q(".hero-scroll"),
    };

    const ctx = gsap.context(() => {
      gsap.set(el.kicker, { opacity: 0, y: 26 });
      gsap.set(el.lines, { yPercent: 118, rotate: 2.5 });
      gsap.set(el.sub, { opacity: 0, y: 32 });
      gsap.set(el.ctas, { opacity: 0, y: 28 });
      gsap.set(el.meta, { opacity: 0, y: 22 });
      gsap.set(el.canvas, { opacity: 0, scale: 1.05 });
      gsap.set(el.kanji, { opacity: 0 });
      gsap.set(el.scroll, { opacity: 0 });

      const play = () => {
        if (!alive) return;
        tl = gsap.timeline();
        tl.to(el.canvas, { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" }, 0)
          .to(el.kicker, { opacity: 1, y: 0, duration: 0.8 }, 0.15)
          .to(el.lines, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.15, ease: "power4.out" }, 0.35)
          .to(el.sub, { opacity: 1, y: 0, duration: 0.9 }, 0.95)
          .to(el.ctas, { opacity: 1, y: 0, duration: 0.85, stagger: 0.13 }, 1.1)
          .to(el.meta, { opacity: 1, y: 0, duration: 0.85 }, 1.3)
          .to(el.kanji, { opacity: 1, duration: 1.4 }, 1.35)
          .to(el.scroll, { opacity: 1, duration: 0.9 }, 1.5);
      };

      onIntroDone(play);
    }, root);

    return () => {
      alive = false;
      tl?.kill();
      ctx.revert();
    };
  }, []);

  /* ---------- Scroll horizontal anclado (desktop) ---------- */
  useEffect(() => {
    const section = hSectionRef.current;
    const track = trackRef.current;
    if (!section || !track || prefersReduced()) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + (distance() + 240),
            pin: true,
            /* El padre del section es display:flex → GSAP desactiva el
               spacing por defecto. Lo forzamos para reservar el scroll. */
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        if (progressRef.current) {
          gsap.fromTo(
            progressRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${distance() + 240}`,
                scrub: 1,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col">
      {/* ==================== HÉROE ==================== */}
      <section
        ref={heroRef}
        aria-label="Presentación de SUMI"
        className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-28 pb-16 lg:pt-32"
      >
        {/* Canvas 3D */}
        <div className="hero-canvas hero-el absolute inset-x-0 top-[38%] bottom-[-6%] opacity-60 lg:inset-0 lg:top-0 lg:bottom-0 lg:left-[30%] lg:opacity-100">
          <Maki3D fallbackImage={assetPath("/images/hero-fallback.jpg")} />
        </div>
        {/* Viñeta para legibilidad */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,#0B0A08_0%,rgba(11,10,8,0.6)_30%,rgba(11,10,8,0.25)_55%,rgba(11,10,8,0.75)_100%)] lg:bg-[linear-gradient(90deg,#0B0A08_28%,rgba(11,10,8,0.55)_48%,transparent_75%)]"
        />

        {/* Kanji decorativo */}
        <span
          aria-hidden="true"
          className="hero-kanji hero-el font-jp pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[22vw] leading-none font-semibold text-gold/[0.055] lg:right-[3vw] lg:text-[15rem]"
        >
          巻
        </span>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
          <p className="hero-kicker hero-el flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-gold">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-gold/70" />
            Maki & Nikkei Bar — Miraflores
          </p>

          <h1 className="mt-7 font-display text-[15.5vw] leading-[0.94] font-medium text-cream sm:text-[12vw] lg:text-[6.8rem] xl:text-[7.6rem]">
            <span className="block overflow-hidden pb-1">
              <span className="hero-line-inner hero-el block">El arte del maki,</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="hero-line-inner hero-el block">
                alma <em className="text-gold-gradient font-light italic">nikkei</em>
              </span>
            </span>
          </h1>

          <p className="hero-sub hero-el mt-8 max-w-md text-base leading-relaxed text-cream/75 sm:text-lg">
            Rolls de autor con técnica japonesa y sazón peruana. Arroz en punto,
            pescado del día y salsas que Lima ya adoptó como propias.
          </p>

          <div className="hero-cta hero-el mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <CtaLink href="/carta" ariaLabel="Ver la carta de makis">
                Ver la carta <MoveRight className="h-4 w-4" aria-hidden="true" />
              </CtaLink>
            </Magnetic>
            <Magnetic>
              <CtaLink href="/carta" variant="ghost" ariaLabel="Armarte un combo">
                Arma tu combo
              </CtaLink>
            </Magnetic>
          </div>

          {/* Meta */}
          <div className="hero-meta hero-el mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-cream/70">
            <span className="flex items-center gap-2">
              <Stars rating={4.9} />
              <span>
                <strong className="text-cream">4.9</strong> · 3,200 reseñas
              </span>
            </span>
            <span aria-hidden="true" className="hidden h-4 w-px bg-gold/25 sm:block" />
            <span>
              Delivery en <strong className="text-cream">25 min</strong> promedio
            </span>
            <span aria-hidden="true" className="hidden h-4 w-px bg-gold/25 sm:block" />
            <span>
              Desde <strong className="text-cream">S/ 26</strong>
            </span>
          </div>
        </div>

        {/* Indicador scroll */}
        <div className="hero-scroll hero-el absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
            Desliza
          </span>
          <span aria-hidden="true" className="relative h-12 w-px overflow-hidden bg-gold/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_1.8s_ease-in-out_infinite] bg-gold" />
          </span>
        </div>
        <style jsx>{`
          @keyframes scrollhint {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(300%); }
          }
        `}</style>
      </section>

      {/* ==================== MARQUESINA ==================== */}
      <div className="relative border-y border-gold/12 bg-surface py-6">
        <Marquee
          items={[
            "Pescado del día",
            "Arroz en punto",
            "Salsa acevichada de la casa",
            "Hecho al momento",
            "Caja térmica",
            "Furikake estilo Lima",
          ]}
        />
      </div>

      {/* ==================== STATS ==================== */}
      <section aria-label="SUMI en números" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 font-display text-[24vw] leading-none font-semibold text-outline opacity-40 select-none lg:text-[17rem]"
        >
          SUMI
        </div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 py-20 sm:px-8 lg:grid-cols-4 lg:py-28">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-reveal="up"
              data-reveal-delay={String(i * 0.08)}
              className="flex flex-col items-center gap-3 px-4 py-8 text-center"
            >
              <span
                data-counter={s.value}
                data-counter-suffix={s.suffix}
                data-counter-decimals={s.decimals ? String(s.decimals) : "0"}
                className="font-display text-5xl font-semibold text-gold-light lg:text-6xl"
              >
                0
              </span>
              <span className="hairline w-10" aria-hidden="true" />
              <span className="max-w-[180px] text-xs leading-relaxed tracking-wide text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FAVORITOS (SCROLL HORIZONTAL) ==================== */}
      <section
        ref={hSectionRef}
        aria-labelledby="favoritos-title"
        className="relative overflow-hidden lg:h-svh"
      >
        <div className="flex h-full flex-col justify-center gap-10 py-20 lg:gap-12 lg:py-0">
          <div className="px-5 sm:px-8 lg:px-[6vw]">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <SectionHeading
                kicker="Los favoritos de Lima"
                title="Los más"
                italic="pedidos"
                description="Seis rolls que se roban la función. Desliza y descubre por qué Lima no deja de pedirlos."
              />
              <div className="hidden flex-col items-end gap-3 lg:flex">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  Sigue deslizando
                </span>
                <div
                  className="h-[2px] w-48 overflow-hidden rounded-full bg-gold/15"
                  aria-hidden="true"
                >
                  <div ref={progressRef} className="h-full w-full origin-left scale-x-0 rounded-full bg-gold" />
                </div>
              </div>
            </div>
          </div>

          <div
            ref={trackRef}
            className="h-scroll snap-x-mandatory flex w-full gap-6 overflow-x-auto px-5 pb-6 sm:px-8 lg:overflow-visible lg:px-[6vw] lg:pb-0"
          >
            {FEATURED.map((p, i) => (
              <div
                key={p.slug}
                className="snap-start-item w-[80vw] max-w-[400px] shrink-0 sm:w-[400px]"
              >
                <ProductCard product={p} priority={i === 0} />
              </div>
            ))}
            <div className="snap-start-item flex w-[70vw] max-w-[340px] shrink-0 items-center justify-center sm:w-[340px]">
              <Link
                href="/carta"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/carta");
                }}
                className="group flex aspect-square w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-gold/30 text-center transition-colors hover:border-gold/60 hover:bg-gold/5"
              >
                <span className="font-jp text-5xl text-gold/70">全巻</span>
                <span className="font-display text-3xl text-cream">
                  Ver toda <em className="text-gold-gradient italic">la carta</em>
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform group-hover:translate-x-2">
                  <MoveRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HISTORIA NIKKEI ==================== */}
      <section aria-labelledby="historia-title" className="relative overflow-hidden py-24 lg:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          {/* Imagen con parallax */}
          <div data-reveal="left" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] sm:aspect-[5/5]">
              <Image
                src={assetPath("/images/story/chef.jpg")}
                alt="Manos del chef Itoshi enrollando un maki sobre tapete de bambú"
                fill
                data-parallax="0.12"
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="scale-[1.25] object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-ink/50 via-transparent to-transparent"
              />
            </div>
            {/* Sello flotante */}
            <div className="absolute -right-4 -bottom-8 hidden rounded-3xl border border-gold/25 bg-ink/90 px-7 py-6 backdrop-blur-md sm:block lg:-right-10">
              <p className="font-display text-4xl font-semibold text-gold">2014</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Desde entonces
              </p>
            </div>
            <span
              aria-hidden="true"
              className="font-jp absolute -top-8 -left-4 text-6xl text-gold/25 lg:-left-10"
            >
              日系
            </span>
          </div>

          <div>
            <SectionHeading
              kicker="Nuestra historia"
              title="Dos culturas,"
              italic="un solo bocado"
              description=""
            />
            <div data-reveal="up" className="mt-6 space-y-5 text-base leading-relaxed text-cream/75">
              <p>
                A inicios del siglo pasado, los primeros japoneses llegaron al Perú
                con sus cuchillos, su arroz y su disciplina. En las cocinas de Lima
                esa técnica se encontró con el ají, la leche de tigre y el limón.
                Nació la cocina nikkei: ni japonesa ni peruana, sino mejor que ambas.
              </p>
              <p>
                SUMI es herencia directa de esa historia. Enrollamos cada maki con
                la precisión de Tokio y lo bañamos con el descaro de Lima: acevichado,
                furikake crocante, camote andino dentro de un roll.
              </p>
            </div>
            <div data-reveal="up" data-reveal-delay="0.15" className="mt-9">
              <CtaLink href="/nosotros" variant="ghost">
                Conoce la casa <MoveRight className="h-4 w-4" aria-hidden="true" />
              </CtaLink>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== COMBOS / OFERTAS ==================== */}
      <section
        aria-labelledby="ofertas-title"
        className="relative overflow-hidden border-y border-gold/12 bg-surface py-24 lg:py-32"
      >
        <div className="pattern-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              kicker="Ofertas de la casa"
              title="Combos para"
              italic="compartir"
              description="Porciones completas, precio de barrio bueno. Delivery gratis en todos los combos."
            />
            <div data-reveal="up" className="hidden lg:block">
              <span className="rounded-full border border-gold/30 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Delivery gratis en combos
              </span>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COMBOS.map((combo, i) => (
              <div
                key={combo.slug}
                data-reveal="up"
                data-reveal-delay={String(i * 0.1)}
              >
                <ProductCard product={combo} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROCESO ==================== */}
      <section aria-labelledby="proceso-title" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Cómo funciona"
            title="Del tapete de bambú"
            italic="a tu puerta"
            align="center"
          />
          <ol className="mt-16 grid gap-10 md:grid-cols-3 lg:mt-20">
            {[
              {
                n: "01",
                icon: MousePointerClick,
                title: "Elige",
                text: "Arma tu pedido desde la carta o entra directo a los combos. Todo llega sellado, con sus salsas y su wasabi.",
              },
              {
                n: "02",
                icon: ChefHat,
                title: "Preparamos",
                text: "Cada maki se enrolla al recibir tu pedido. Cero stock, cero maki dormido: el arroz nunca espera.",
              },
              {
                n: "03",
                icon: Bike,
                title: "Disfruta",
                text: "Delivery propio con caja térmica. Del tablero de bambú a tu mesa en 25 minutos promedio.",
              },
            ].map((step, i) => (
              <li
                key={step.n}
                data-reveal="up"
                data-reveal-delay={String(i * 0.12)}
                className="group relative rounded-[2rem] border border-gold/10 bg-surface p-8 transition-colors hover:border-gold/30"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-transform duration-500 group-hover:scale-110">
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-display text-5xl font-semibold text-cream/8 transition-colors group-hover:text-gold/25">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-7 font-display text-3xl font-medium text-cream">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ==================== TESTIMONIOS ==================== */}
      <section
        aria-labelledby="testimonios-title"
        className="relative overflow-hidden border-y border-gold/12 bg-surface py-24 lg:py-32"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-display text-[22rem] leading-none text-gold/[0.04] select-none"
        >
          “
        </span>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Lo que dice Lima"
            title="3,200 reseñas"
            italic="después"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                data-reveal="up"
                data-reveal-delay={String((i % 2) * 0.1)}
                className="relative rounded-[2rem] border border-gold/10 bg-ink p-8 transition-colors hover:border-gold/25"
              >
                <Quote className="h-6 w-6 text-gold/50" aria-hidden="true" />
                <blockquote className="mt-5 text-[15px] leading-relaxed text-cream/85">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between border-t border-gold/10 pt-5">
                  <div>
                    <p className="font-semibold text-cream">{t.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {t.district}
                    </p>
                  </div>
                  <Stars rating={t.rating} />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BANNER PARALLAX ==================== */}
      <section aria-label="Frase de la casa" className="relative h-[64vh] overflow-hidden lg:h-[80vh]">
        <Image
          src={assetPath("/images/story/chopsticks.jpg")}
          alt="Palillos tomando un maki de salmón sobre fondo oscuro"
          fill
          data-parallax="0.16"
          sizes="100vw"
          className="scale-[1.3] object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-ink/65"
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
          <Kicker className="justify-center">La promesa SUMI</Kicker>
          <h2
            data-split
            className="max-w-4xl font-display text-4xl leading-[1.08] font-medium text-cream sm:text-6xl lg:text-7xl"
          >
            Hecho al momento. Entregado{" "}
            <em className="text-gold-gradient font-light italic">con obsesión.</em>
          </h2>
          <div data-reveal="up" data-reveal-delay="0.2">
            <Magnetic>
              <CtaLink href="/carta" ariaLabel="Pedir ahora">
                Pedir ahora <MoveRight className="h-4 w-4" aria-hidden="true" />
              </CtaLink>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ==================== CTA FINAL + ZONAS ==================== */}
      <section aria-labelledby="cta-final" className="relative overflow-hidden py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <h2 id="cta-final" data-split className="mx-auto max-w-3xl font-display text-5xl leading-[1.02] font-medium text-cream sm:text-6xl lg:text-7xl">
            ¿Ya se te antojó <em className="text-gold-gradient font-light italic">un maki?</em>
          </h2>
          <p data-reveal="up" className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            La cocina abre a las 13:00. El primer delivery sale a las 13:15.
            El resto de la historia la escribes tú.
          </p>
          <div data-reveal="up" data-reveal-delay="0.1" className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <CtaLink href="/carta">Ver la carta</CtaLink>
            </Magnetic>
            <Magnetic>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=Hola%20SUMI%2C%20quiero%20hacer%20un%20pedido`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.18em]"
                aria-label="Escríbenos por WhatsApp"
              >
                Pedir por WhatsApp
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Zonas de delivery */}
        <div className="mt-20 border-y border-gold/10 py-6">
          <Marquee
            reverse
            withStar={false}
            speed={46}
            items={SITE.zones.map((z) => `Delivery en ${z}`)}
          />
        </div>
      </section>
    </div>
  );
}
