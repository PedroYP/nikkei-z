"use client";

/* ============================================================
   AppShell · SPA: cortina de transición + cambio de vista +
   layout sticky-footer (WCAG: landmarks, skip-link, foco)
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { useRouter, type Route } from "@/lib/router";
import { gsap, prefersReduced } from "@/lib/anim";
import { scrollToTop } from "@/components/site/providers";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import CartDrawer from "@/components/site/cart-drawer";
import HomeView from "@/components/site/views/home";
import AboutView from "@/components/site/views/about";
import MenuView from "@/components/site/views/menu";
import ProductView from "@/components/site/views/product";
import CartView from "@/components/site/views/cart";
import ContactView from "@/components/site/views/contact";

function renderView(route: Route) {
  switch (route.view) {
    case "about":
      return <AboutView />;
    case "menu":
      return <MenuView />;
    case "product":
      return <ProductView slug={route.slug!} />;
    case "cart":
      return <CartView />;
    case "contact":
      return <ContactView />;
    default:
      return <HomeView />;
  }
}

export default function AppShell() {
  const { route } = useRouter();
  const [displayRoute, setDisplayRoute] = useState<Route>(route);
  const curtainRef = useRef<HTMLDivElement>(null);
  const pending = useRef<Route | null>(null);

  /* Transición con cortina al cambiar de vista */
  useEffect(() => {
    if (route === displayRoute) return;

    if (prefersReduced()) {
      /* Menos movimiento: cambio directo en el siguiente frame */
      const raf = requestAnimationFrame(() => {
        setDisplayRoute(route);
        scrollToTop(true);
      });
      return () => cancelAnimationFrame(raf);
    }

    const curtain = curtainRef.current;
    if (!curtain) return;
    pending.current = route;
    let committed = false;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.set(curtain, { visibility: "visible", pointerEvents: "auto" })
        .set(".curtain-panel", { transformOrigin: "50% 100%" })
        .fromTo(
          ".curtain-panel",
          { scaleY: 0 },
          { scaleY: 1, duration: 0.42, stagger: 0.05, ease: "power3.inOut" }
        )
        .add(() => {
          committed = true;
          setDisplayRoute(pending.current ?? route);
          scrollToTop(true);
        })
        .fromTo(
          ".curtain-kanji",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.32 },
          "-=0.02"
        )
        .to(".curtain-kanji", { opacity: 0, duration: 0.22 }, "+=0.4")
        .set(".curtain-panel", { transformOrigin: "50% 0%" })
        .to(
          ".curtain-panel",
          { scaleY: 0, duration: 0.55, stagger: 0.05, ease: "power3.inOut" }
        )
        .set(curtain, { visibility: "hidden", pointerEvents: "none" });
    }, curtain);

    return () => {
      ctx.revert();
      if (!committed) setDisplayRoute(route);
    };
  }, [route]);

  const viewKey = `${displayRoute.view}:${displayRoute.slug ?? ""}`;

  return (
    <div className="flex min-h-svh flex-col bg-ink">
      {/* Skip link accesible (sin href="#..." para no chocar con el hash-router) */}
      <button
        type="button"
        onClick={() => {
          const main = document.getElementById("contenido");
          main?.focus({ preventScroll: true });
          scrollToTop(true);
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-xs focus:font-bold focus:text-ink"
      >
        Saltar al contenido principal
      </button>

      <Navbar />

      <main
        id="contenido"
        key={viewKey}
        tabIndex={-1}
        className="flex flex-1 flex-col focus:outline-none"
      >
        {renderView(displayRoute)}
      </main>

      <Footer />
      <CartDrawer />

      {/* Cortina de transición */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[110] flex"
      >
        <div className="curtain-panel relative h-full flex-1 bg-[#0D0B08] [border-right:1px_rgba(201,162,75,0.08)]" />
        <div className="curtain-panel relative h-full flex-1 bg-[#100E0A] [border-right:1px_rgba(201,162,75,0.08)]" />
        <div className="curtain-panel relative h-full flex-1 bg-[#0D0B08] [border-right:1px_rgba(201,162,75,0.08)]" />
        <div className="curtain-panel relative h-full flex-1 bg-[#100E0A] [border-right:1px_rgba(201,162,75,0.08)]" />
        <div className="curtain-panel relative h-full flex-1 bg-[#0D0B08]" />
        <span className="curtain-kanji absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-jp text-2xl font-semibold tracking-[0.5em] text-gold opacity-0">
          巻
        </span>
      </div>
    </div>
  );
}
