"use client";

/* ============================================================
   VISTA · NOSOTROS · historia nikkei, chef, valores, manifiesto
   ============================================================ */

import Image from "next/image";
import { Anchor, Fish, HeartHandshake, Landmark, ScrollText, Sparkles } from "lucide-react";
import { useViewFx } from "@/lib/anim";
import { CtaLink, Kicker, Magnetic, Marquee, SectionHeading } from "@/components/site/ui-bits";
import { SITE, STATS } from "@/lib/data";
import { assetPath } from "@/lib/assets";
import { MoveRight } from "lucide-react";

const TIMELINE = [
  {
    year: "1903",
    title: "El primer barco",
    text: "El Sakura Maru trae a los primeros 790 japoneses al Callao. Entre sus maletas: semillas de arroz, cuchillos yanagiba y una disciplina milenaria.",
  },
  {
    year: "1987",
    title: "La fusión accidental",
    text: "En las cevicherías de Lima, los cocineros nikkei empiezan a bañar el pescado crudo con leche de tigre y ají limo. Nace, sin bautizar, la cocina nikkei.",
  },
  {
    year: "2014",
    title: "Abre SUMI",
    text: "La familia Oshiro abre un local de ocho metros en Miraflores con dos mesas y un cartel de neón: “Si el arroz no está en punto, no sale”.",
  },
  {
    year: "2019",
    title: "El furikake que rompió Lima",
    text: "Lanzamos el arroz crocante furikake con salmón crudo. La fila llegó a la esquina y la receta sigue intacta desde entonces.",
  },
  {
    year: "Hoy",
    title: "Tu mesa",
    text: "Dos locales, un equipo de 34 personas y la misma obsesión del primer día: que cada pieza valga la pena.",
  },
];

const VALUES = [
  {
    icon: Fish,
    title: "Frescura fanática",
    text: "Compramos en el terminal de Surquillo cada mañana. Lo que no se vende hoy, no ve mañana: ni en sushi, ni en la carta.",
  },
  {
    icon: ScrollText,
    title: "Técnica japonesa",
    text: "Cortes yanagiba, arroz a 36°C sazonado con vinagre añejo, presión exacta por pieza. La técnica no se negocia.",
  },
  {
    icon: Sparkles,
    title: "Alma nikkei",
    text: "Leche de tigre, ají limo, camote crocante y lúcuma. El Perú entra a la carta por la puerta grande, sin disfraz.",
  },
  {
    icon: HeartHandshake,
    title: "Calidez de barrio",
    text: "Te atendemos como en casa: te recordamos tu pedido de siempre y te avisamos si el maki que amas cambia de precio.",
  },
];

export default function AboutView() {
  const rootRef = useViewFx<HTMLElement>();

  return (
    <div ref={rootRef} className="flex flex-col">
      {/* ==================== HÉROE ==================== */}
      <section
        aria-labelledby="nosotros-title"
        className="relative flex min-h-[72svh] flex-col justify-center overflow-hidden pt-32 pb-16"
      >
        <span
          aria-hidden="true"
          className="font-jp pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[26vw] leading-none font-semibold text-gold/[0.05] lg:text-[18rem]"
        >
          和
        </span>
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Kicker>Nosotros · 私たち</Kicker>
          <h1
            data-split
            className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] font-medium text-cream sm:text-7xl lg:text-8xl"
          >
            La casa del <em className="text-gold-gradient font-light italic">maki nikkei</em>
          </h1>
          <p data-reveal="up" className="mt-8 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
            SUMI nació de una pregunta simple: ¿qué pasa si el rigor de Tokio se
            enamora del sabor de Lima? Doce años después, seguimos respondiendo
            con cada pieza.
          </p>
        </div>

        <div className="relative mt-14 border-y border-gold/12 bg-surface py-5">
          <Marquee
            reverse
            speed={42}
            items={["Desde 2014", "Familia Oshiro", "Miraflores · Lima", "Técnica + sazón", "Arroz en punto", "Pescado del día"]}
          />
        </div>
      </section>

      {/* ==================== HISTORIA / TIMELINE ==================== */}
      <section aria-labelledby="historia-title" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading
                kicker="La línea de tiempo"
                title="De Yokohama"
                italic="a Miraflores"
                description="Tres generaciones y un océano de por medio: la historia de cómo el maki aprendió a hablar peruano."
              />
              <div data-reveal="up" className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image
                  src={assetPath("/images/story/interior.jpg")}
                  alt="Interior del bar de SUMI en Miraflores: madera oscura y luz cálida"
                  fill
                  data-parallax="0.1"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="scale-[1.22] object-cover"
                />
              </div>
            </div>

            <ol className="relative space-y-12 lg:space-y-0">
              <div
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-[7px] hidden w-px bg-gradient-to-b from-gold/40 via-gold/15 to-transparent lg:block"
              />
              {TIMELINE.map((t, i) => (
                <li
                  key={t.year}
                  data-reveal="up"
                  data-reveal-delay={String(i * 0.05)}
                  className="relative lg:pl-14 lg:pb-14"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 left-0 hidden h-[15px] w-[15px] rounded-full border-2 border-gold bg-ink lg:block"
                  />
                  <p className="font-display text-4xl font-semibold text-gold-light lg:text-5xl">{t.year}</p>
                  <h3 className="mt-2 font-display text-2xl font-medium text-cream">{t.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ==================== CHEF ==================== */}
      <section
        aria-labelledby="chef-title"
        className="relative overflow-hidden border-y border-gold/12 bg-surface py-24 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div data-reveal="right" className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
              <Image
                src={assetPath("/images/story/chef.jpg")}
                alt="Chef Dani Oshiro enrollando maki sobre tapete de bambú en la cocina de SUMI"
                fill
                data-parallax="0.12"
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="scale-[1.25] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 left-6 rounded-3xl border border-gold/25 bg-ink/90 px-8 py-6 backdrop-blur-md lg:-left-8">
              <p className="font-jp text-lg text-gold">大城 ダニ</p>
              <p className="mt-1 font-display text-2xl font-medium text-cream">Dani Oshiro</p>
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Chef ejecutivo · 2.ª generación
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading kicker="El chef" title="Criado entre" italic="dos cocinas" />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-cream/75">
              <p>
                Dani creció lavando arroz en el restaurante de su abuelo en
                Surquillo y de adolescente pasó los veranos en la cevichería de su
                tía en Chorrillos. “Mi abuelo cortaba con precisión quirúrgica; mi
                tía cocinaba con volumen a todo lo que daba. Yo solo junté las dos
                cosas”.
              </p>
              <p>
                Hoy comanda un equipo de once cocineros con una sola regla
                colgada en la pared de la cocina: 出来ないは別の言葉で言う —
                “no se puede” se dice de otra manera.
              </p>
            </div>
            <blockquote
              data-reveal="up"
              className="mt-8 rounded-3xl border-l-2 border-gold bg-ink/60 p-7"
            >
              <p className="font-display text-2xl leading-snug font-light text-cream italic">
                “Un maki se sostiene con las manos, pero se gana con el sazón.
                Sin Perú, esto sería solo técnica. Sin Japón, solo sería ruido.”
              </p>
              <footer className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-gold">
                — Dani Oshiro
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ==================== VALORES ==================== */}
      <section aria-labelledby="valores-title" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Lo que nos mueve"
            title="Cuatro reglas"
            italic="sin excepción"
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <article
                key={v.title}
                data-reveal="up"
                data-reveal-delay={String(i * 0.08)}
                className="group rounded-[2rem] border border-gold/10 bg-surface p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/30"
              >
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <v.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-medium text-cream">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MANIFIESTO + STATS ==================== */}
      <section
        aria-labelledby="manifiesto-title"
        className="relative overflow-hidden border-y border-gold/12 bg-surface py-24 lg:py-32"
      >
        <div className="pattern-dots pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <Kicker className="justify-center">El manifiesto</Kicker>
          <h2
            data-split
            className="mt-6 font-display text-4xl leading-[1.1] font-medium text-cream sm:text-5xl lg:text-6xl"
          >
            No vendemos sushi rápido.
            <br />
            Vendemos <em className="text-gold-gradient font-light italic">el mejor maki de tu semana.</em>
          </h2>
          <p data-reveal="up" className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Si esa frase suena pretenciosa, es porque lo es. Pero cada decisión
            de esta casa —comprar cada mañana, enrollar bajo pedido, entregar en
            caja térmica— existe solo para cumplirla.
          </p>
          <div className="mt-16 grid grid-cols-2 gap-px lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2 px-4 py-6">
                <span
                  data-counter={s.value}
                  data-counter-suffix={s.suffix}
                  data-counter-decimals={s.decimals ? String(s.decimals) : "0"}
                  className="font-display text-4xl font-semibold text-gold-light lg:text-5xl"
                >
                  0
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section aria-labelledby="about-cta" className="relative overflow-hidden py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <h2 id="about-cta" data-split className="font-display text-4xl leading-[1.05] font-medium text-cream sm:text-6xl">
            La mejor forma de conocernos
            <br />
            es <em className="text-gold-gradient font-light italic">probándonos.</em>
          </h2>
          <div data-reveal="up" className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <CtaLink href="/carta">
                Ver la carta <MoveRight className="h-4 w-4" aria-hidden="true" />
              </CtaLink>
            </Magnetic>
            <Magnetic>
              <CtaLink href="/contacto" variant="ghost">
                Visítanos en Miraflores
              </CtaLink>
            </Magnetic>
          </div>
          <p data-reveal="up" data-reveal-delay="0.15" className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Anchor className="h-4 w-4 text-gold/70" aria-hidden="true" />
            {SITE.address} · {SITE.city}
          </p>
        </div>
      </section>
    </div>
  );
}
