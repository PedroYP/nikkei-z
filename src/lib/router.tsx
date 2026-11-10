"use client";

/* ============================================================
   Router SPA por hash — toda la web vive en la ruta `/`.
   #/  ·  #/nosotros  ·  #/carta  ·  #/producto/<slug>
   #/carrito  ·  #/contacto
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ViewName = "home" | "about" | "menu" | "product" | "cart" | "contact";

export interface Route {
  view: ViewName;
  slug?: string;
}

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!clean || clean === "inicio") return { view: "home" };
  const [head, slug] = clean.split("/");

  switch (head) {
    case "nosotros":
      return { view: "about" };
    case "carta":
      return { view: "menu" };
    case "producto":
      return slug ? { view: "product", slug } : { view: "menu" };
    case "carrito":
      return { view: "cart" };
    case "contacto":
      return { view: "contact" };
    default:
      return { view: "home" };
  }
}

interface RouterCtx {
  route: Route;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterCtx>({
  route: { view: "home" },
  navigate: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>({ view: "home" });

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((path: string) => {
    const target = path.startsWith("#") ? path : `#${path.startsWith("/") ? path : `/${path}`}`;
    if (window.location.hash === target) return;
    window.location.hash = target;
  }, []);

  const value = useMemo(() => ({ route, navigate }), [route, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}
