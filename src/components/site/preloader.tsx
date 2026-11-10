"use client";

/* ============================================================
   Preloader · primera impresión: ensō dorado, kanji y cortina
   (sin setState síncrono: controla el DOM directamente)
   ============================================================ */

import { useEffect, useRef } from "react";
import { gsap, prefersReduced, markIntroDone, isIntroDone } from "@/lib/anim";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const hide = () => {
      root.style.display = "none";
    };

    /* Si ya pasó la intro o el usuario prefiere menos movimiento */
    if (isIntroDone() || prefersReduced()) {
      markIntroDone();
      hide();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          markIntroDone();
          hide();
        },
      });

      tl.fromTo(
        ".pre-kanji",
        { opacity: 0, scale: 0.82, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" }
      )
        .fromTo(
          ".pre-ring",
          { drawSVG: "0%", opacity: 0, rotate: -90 },
          { drawSVG: "100%", opacity: 1, rotate: 0, duration: 1.2, ease: "power2.inOut" },
          0.1
        )
        .fromTo(
          ".pre-word span",
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power4.out" },
          0.5
        )
        .fromTo(
          ".pre-tag",
          { opacity: 0, letterSpacing: "0.9em" },
          { opacity: 1, letterSpacing: "0.42em", duration: 0.9, ease: "power2.out" },
          0.9
        )
        .to(".pre-inner", { opacity: 0, y: -26, duration: 0.55, ease: "power2.in" }, 1.9)
        .to(
          ".pre-curtain",
          { scaleY: 0, transformOrigin: "top", duration: 0.85, ease: "power4.inOut", stagger: 0.07 },
          2.15
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[120] flex items-center justify-center"
      role="status"
      aria-label="Cargando SUMI"
    >
      {/* Cortinas */}
      <div className="pre-curtain absolute inset-0 bg-ink" />
      <div className="pre-curtain absolute inset-0 bg-ink" style={{ clipPath: "inset(0 0 66% 0)" }} />
      <div className="pre-curtain absolute inset-0 bg-ink" style={{ clipPath: "inset(0 0 33% 0)" }} />

      <div className="pre-inner relative flex flex-col items-center gap-6">
        {/* Ensō + kanji */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="pre-ring absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M 50 6 A 44 44 0 1 0 94 58"
              fill="none"
              stroke="#C9A24B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="pre-kanji font-jp text-5xl font-semibold text-gold">巻</span>
        </div>

        {/* Wordmark */}
        <div className="overflow-hidden">
          <p className="pre-word font-display flex text-4xl font-semibold tracking-[0.34em] text-cream sm:text-5xl">
            {"SUMI".split("").map((c, i) => (
              <span key={i} className="inline-block">
                {c}
              </span>
            ))}
          </p>
        </div>
        <p className="pre-tag text-[10px] font-bold uppercase text-gold/80">
          Maki · Nikkei · Lima
        </p>
      </div>
    </div>
  );
}
