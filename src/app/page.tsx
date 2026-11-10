"use client";

/* ============================================================
   SUMI · Maki & Nikkei Bar — punto de entrada
   (toda la web vive en la ruta / mediante hash-router)
   ============================================================ */

import Providers from "@/components/site/providers";
import { RouterProvider } from "@/lib/router";
import AppShell from "@/components/site/app-shell";
import Preloader from "@/components/site/preloader";

export default function Page() {
  return (
    <Providers>
      <RouterProvider>
        <Preloader />
        <AppShell />
      </RouterProvider>
    </Providers>
  );
}
