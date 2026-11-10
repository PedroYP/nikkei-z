"use client";

/* ============================================================
   Motor de animación · GSAP + Lenis + accesibilidad
   Convenciones por atributos:
   · data-reveal="up|down|left|right|scale|blur" · data-reveal-delay
   · data-split (título con líneas enmascaradas)
   · data-counter / data-counter-decimals / data-counter-suffix
   · data-parallax="0.15"
   ============================================================ */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  registered = true;
}

export { gsap, ScrollTrigger, SplitText };

export function prefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- Estado de la intro (comunicación preloader → hero) ---------- */

let introDone = false;
const introListeners = new Set<() => void>();

export function markIntroDone(): void {
  introDone = true;
  introListeners.forEach((l) => l());
  introListeners.clear();
}

export function onIntroDone(cb: () => void): () => void {
  if (introDone) {
    cb();
    return () => undefined;
  }
  introListeners.add(cb);
  return () => introListeners.delete(cb);
}

export function isIntroDone(): boolean {
  return introDone;
}

/* ---------- Hook FX de vista: reveals, splits, counters, parallax ---------- */

export function useViewFx<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    /* Accesibilidad: sin movimiento, contenido visible directo */
    if (prefersReduced()) {
      gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1 });
      root.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
        el.textContent =
          (el.dataset.counter || "0") + (el.dataset.counterSuffix || "");
      });
      return;
    }

    const ctx = gsap.context(() => {
      /* Reveal genérico */
      root!.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const type = el.dataset.reveal || "up";
        const delay = parseFloat(el.dataset.revealDelay || "0");
        const from: gsap.TweenVars = { opacity: 0 };
        if (type === "up") from.y = 56;
        else if (type === "down") from.y = -56;
        else if (type === "left") from.x = 56;
        else if (type === "right") from.x = -56;
        else if (type === "scale") { from.scale = 0.9; from.y = 24; }
        else if (type === "blur") { from.filter = "blur(14px)"; from.y = 30; }

        gsap.fromTo(
          el,
          from,
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.1,
            delay,
            overwrite: "auto",
            clearProps: "filter",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      /* Títulos con líneas enmascaradas */
      root!.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        try {
          const split = new SplitText(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
          });
          if (!split.lines.length) return;
          gsap.fromTo(
            split.lines,
            { yPercent: 112, rotate: 1.2 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.15,
              ease: "power4.out",
              stagger: 0.11,
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
            }
          );
        } catch {
          /* SplitText falla silenciosamente si el layout cambia */
        }
      });

      /* Contadores numéricos */
      root!.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
        const end = parseFloat(el.dataset.counter || "0");
        const decimals = parseInt(el.dataset.counterDecimals || "0", 10);
        const suffix = el.dataset.counterSuffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals) + suffix;
          },
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* Parallax suave */
      root!.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.12");
        gsap.fromTo(
          el,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });
    }, root);

    /* Espera un frame a que el layout esté estable (fuentes, imágenes) */
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return ref;
}
