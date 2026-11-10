/* ============================================================
   SUMI · Maki & Nikkei Bar — Datos del sitio
   Carta nikkei de autor · Lima, Perú
   ============================================================ */

import { assetPath } from "@/lib/assets";

export type CategoryId =
  | "clasico"
  | "especial"
  | "furikake"
  | "tempura"
  | "veggie"
  | "postre"
  | "bebida"
  | "combo";

export interface Category {
  id: CategoryId;
  label: string;
  jp: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  jp: string;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  pieces: number;
  description: string;
  ingredients: string[];
  spice: 0 | 1 | 2 | 3;
  badges: Array<"bestseller" | "nuevo" | "veggie" | "picante">;
  image: string;
  featured?: boolean;
  rating: number;
}

export const CATEGORIES: Category[] = [
  { id: "clasico", label: "Clásicos", jp: "古典", description: "Los que nunca fallan, en su punto exacto" },
  { id: "especial", label: "Especiales", jp: "特別", description: "Rolls de autor, técnica y osadía" },
  { id: "furikake", label: "Furikake", jp: "振り掛け", description: "Arroz crocante estilo Lima, furikake de la casa" },
  { id: "tempura", label: "Tempura", jp: "天ぷら", description: "Crocante por fuera, jugoso por dentro" },
  { id: "veggie", label: "Veggie", jp: "菜食", description: "Del huerto al rollo, sin sacrificar nada" },
  { id: "postre", label: "Postres", jp: "甘味", description: "El cierre dulce que merece tu mesa" },
  { id: "bebida", label: "Bebidas", jp: "飲み物", description: "Para acompañar, refrescar y brindar" },
  { id: "combo", label: "Combos", jp: "詰合", description: "Para compartir. O no." },
];

export const PRODUCTS: Product[] = [
  /* ---------- CLÁSICOS ---------- */
  {
    slug: "philadelphia",
    name: "Philadelphia",
    jp: "巻き · クラシコ",
    category: "clasico",
    price: 32,
    pieces: 8,
    description:
      "El eterno: salmón rosado en láminas, queso crema batido a punto seda y palta cremosa. Arroz sazonado con nuestro vinagre de arroz añejo.",
    ingredients: ["Salmón", "Queso crema", "Palta", "Sésamo"],
    spice: 0,
    badges: ["bestseller"],
    image: assetPath("/images/products/philadelphia.jpg"),
    featured: true,
    rating: 4.9,
  },
  {
    slug: "california",
    name: "California Sumi",
    jp: "巻き · クラシコ",
    category: "clasico",
    price: 28,
    pieces: 8,
    description:
      "Kanikama desmenuzado, palta y quinua crocante andina por fuera: el clásico con acento peruano que Lima adoptó como propio.",
    ingredients: ["Kanikama", "Palta", "Quinua crocante", "Mayonesa japonesa"],
    spice: 0,
    badges: [],
    image: assetPath("/images/products/california.jpg"),
    rating: 4.7,
  },
  {
    slug: "acevichado",
    name: "Acevichado",
    jp: "巻き · ニッケイ",
    category: "clasico",
    price: 36,
    pieces: 8,
    description:
      "Nuestro orgullo nikkei: langostino crocante y salmón bañados en salsa acevichada de la casa, con leche de tigre, ají limo y cilantro fresco.",
    ingredients: ["Salmón", "Langostino crocante", "Salsa acevichada", "Leche de tigre", "Ají limo"],
    spice: 2,
    badges: ["bestseller", "picante"],
    image: assetPath("/images/products/acevichado.jpg"),
    featured: true,
    rating: 5.0,
  },
  {
    slug: "kanikama-crunch",
    name: "Kanikama Crunch",
    jp: "巻き · クラシコ",
    category: "clasico",
    price: 26,
    pieces: 8,
    description:
      "Kanikama tempurizado al momento, pepino japonés y strands de panko dorado. Textura que se escucha al morder.",
    ingredients: ["Kanikama tempurizado", "Pepino", "Panko", "Salsa teriyaki suave"],
    spice: 0,
    badges: [],
    image: assetPath("/images/products/california.jpg"),
    rating: 4.6,
  },

  /* ---------- ESPECIALES ---------- */
  {
    slug: "dragon-roll",
    name: "Dragon Roll",
    jp: "龍巻き",
    category: "especial",
    price: 44,
    pieces: 8,
    description:
      "Langostino tempura coronado con abanico de palta, glaseado unagi tibio y mayonesa japonesa flameada con soplete.",
    ingredients: ["Langostino tempura", "Palta", "Glaseado unagi", "Mayonesa flameada", "Masago"],
    spice: 0,
    badges: ["bestseller"],
    image: assetPath("/images/products/dragon.jpg"),
    featured: true,
    rating: 4.9,
  },
  {
    slug: "rainbow-roll",
    name: "Rainbow Roll",
    jp: "虹巻き",
    category: "especial",
    price: 46,
    pieces: 8,
    description:
      "Philadelphia envuelto en un manto de sashimi del día: salmón, atún, hamachi y hamachi ahumado. Un arcoíris que se deshace en la boca.",
    ingredients: ["Salmón", "Atún", "Hamachi", "Palta", "Queso crema"],
    spice: 0,
    badges: [],
    image: assetPath("/images/products/rainbow.jpg"),
    featured: true,
    rating: 4.8,
  },
  {
    slug: "nikkei-roll",
    name: "Nikkei Roll",
    jp: "日系巻き",
    category: "especial",
    price: 40,
    pieces: 8,
    description:
      "Atún fresco macerado segundos en leche de tigre, camote crocante andino y ají limo. El Perú y Japón en un solo bocado.",
    ingredients: ["Atún", "Leche de tigre", "Camote crocante", "Ají limo", "Culantro"],
    spice: 2,
    badges: ["nuevo", "picante"],
    image: assetPath("/images/products/acevichado.jpg"),
    featured: true,
    rating: 4.9,
  },
  {
    slug: "sake-nigiri",
    name: "Nigiri Sake",
    jp: "鮭握り",
    category: "especial",
    price: 34,
    pieces: 6,
    description:
      "Seis nigiris de salmón del día, cortados en cuchilla yanagiba y flameados a la mesa con soplete de cocina.",
    ingredients: ["Salmón del día", "Arroz avinagrado", "Wasabi fresco", "Salsa nikiri"],
    spice: 0,
    badges: [],
    image: assetPath("/images/products/nigiri.jpg"),
    rating: 4.8,
  },

  /* ---------- FURIKAKE ---------- */
  {
    slug: "furikake-sake",
    name: "Furikake Sake",
    jp: "振り掛け",
    category: "furikake",
    price: 38,
    pieces: 8,
    description:
      "Tatami de arroz crocante furikake, cubos de salmón crudo, sésamo negro y nuestra mayonesa acebichada. El furikake que arrasó en Barranco.",
    ingredients: ["Arroz crocante", "Salmón", "Sésamo negro", "Mayonesa acebichada", "Cebolla china"],
    spice: 1,
    badges: ["bestseller"],
    image: assetPath("/images/products/furikake.jpg"),
    featured: true,
    rating: 4.9,
  },
  {
    slug: "furikake-acevichado",
    name: "Furikake Acevichado",
    jp: "振り掛け · ニッケイ",
    category: "furikake",
    price: 40,
    pieces: 8,
    description:
      "Arroz crocante, salmón en cubos y langostino, bañados en salsa acevichada espumada con leche de tigre helada. Crocante, ácido, letal.",
    ingredients: ["Arroz crocante", "Salmón", "Langostino", "Salsa acevichada", "Leche de tigre"],
    spice: 2,
    badges: ["nuevo", "picante"],
    image: assetPath("/images/products/furikake.jpg"),
    rating: 4.9,
  },

  /* ---------- TEMPURA ---------- */
  {
    slug: "tempurizado",
    name: "Tempurizado Roll",
    jp: "天ぷら巻き",
    category: "tempura",
    price: 36,
    pieces: 8,
    description:
      "Philadelphia rebozado en tempura liviana, fritado 40 segundos exactos y bañado en salsa acebichada. Se sirve humeante.",
    ingredients: ["Philadelphia", "Masa tempura", "Salsa acebichada", "Sésamo"],
    spice: 1,
    badges: ["bestseller"],
    image: assetPath("/images/products/tempura.jpg"),
    rating: 4.8,
  },
  {
    slug: "ebi-crunch",
    name: "Ebi Crunch",
    jp: "海老天巻き",
    category: "tempura",
    price: 38,
    pieces: 8,
    description:
      "Langostino entero en tempura crujiente, pepino japonés y hilos de panko frito. Bañado en mayonesa de la casa con toque de yuzu.",
    ingredients: ["Langostino tempura", "Pepino japonés", "Panko", "Mayonesa yuzu"],
    spice: 0,
    badges: [],
    image: assetPath("/images/products/tempura.jpg"),
    rating: 4.7,
  },

  /* ---------- VEGGIE ---------- */
  {
    slug: "garden-roll",
    name: "Garden Roll",
    jp: "菜巻き",
    category: "veggie",
    price: 26,
    pieces: 8,
    description:
      "Palta, mango maduro, pepino y espárrago salteado con aceite de sésamo. Ligero, dulce y perfecto para compartir.",
    ingredients: ["Palta", "Mango", "Pepino", "Espárrago", "Aceite de sésamo"],
    spice: 0,
    badges: ["veggie"],
    image: assetPath("/images/products/veggie.jpg"),
    rating: 4.6,
  },
  {
    slug: "veggie-furikake",
    name: "Veggie Furikake",
    jp: "菜振り掛け",
    category: "veggie",
    price: 30,
    pieces: 8,
    description:
      "Arroz crocante furikake con palta, mango, sésamo negro y mayonesa de miso blanca. Crocante y verde, sin pescado y sin piedad.",
    ingredients: ["Arroz crocante", "Palta", "Mango", "Sésamo negro", "Mayonesa de miso"],
    spice: 0,
    badges: ["veggie", "nuevo"],
    image: assetPath("/images/products/veggie.jpg"),
    rating: 4.7,
  },

  /* ---------- POSTRES ---------- */
  {
    slug: "dorayaki-lucuma",
    name: "Dorayaki de Lúcuma",
    jp: "どら焼き",
    category: "postre",
    price: 16,
    pieces: 2,
    description:
      "Dos dorayakis esponjosos rellenos de crema de lúcuma andina. La fruta sagrada de los incas, estilo Tokio.",
    ingredients: ["Lúcuma", "Crema pastelera", "Miel de caña"],
    spice: 0,
    badges: [],
    image: assetPath("/images/products/dorayaki.jpg"),
    rating: 4.8,
  },
  {
    slug: "cheesecake-matcha",
    name: "Cheesecake de Matcha",
    jp: "抹茶チーズケーキ",
    category: "postre",
    price: 18,
    pieces: 1,
    description:
      "Cheesecake japonés de matcha cerimonial Uji, textura de nube y corteza dorada. Se deshace, literalmente.",
    ingredients: ["Matcha Uji", "Queso crema", "Azúcar moscabado"],
    spice: 0,
    badges: ["bestseller"],
    image: assetPath("/images/products/matcha.jpg"),
    rating: 4.9,
  },

  /* ---------- BEBIDAS ---------- */
  {
    slug: "chicha-morada",
    name: "Chicha Morada de la Casa",
    jp: "紫玉米",
    category: "bebida",
    price: 12,
    pieces: 1,
    description:
      "Maíz morado, piña, canela y clavo. Macerada 12 horas, servida bien helada. La compañera oficial del acevichado.",
    ingredients: ["Maíz morado", "Piña", "Canela", "Clavo de olor", "Lima"],
    spice: 0,
    badges: ["bestseller"],
    image: assetPath("/images/products/chicha.jpg"),
    rating: 4.9,
  },
  {
    slug: "maracuya-fresh",
    name: "Maracuyá Fresh",
    jp: "百香果",
    category: "bebida",
    price: 10,
    pieces: 1,
    description:
      "Maracuyá de Caraz batido en frío con hierbabuena y un toque de jengibre. Frescura ácida para limpiar el paladar.",
    ingredients: ["Maracuyá", "Hierbabuena", "Jengibre", "Agua de coco"],
    spice: 0,
    badges: [],
    image: assetPath("/images/products/maracuya.jpg"),
    rating: 4.7,
  },

  /* ---------- COMBOS / OFERTAS ---------- */
  {
    slug: "combo-pareja",
    name: "Combo Pareja",
    jp: "二人 · デート",
    category: "combo",
    price: 79,
    oldPrice: 96,
    pieces: 16,
    description:
      "2 Philadelphia + 2 Acevichado + chicha morada de la casa. La excusa perfecta para quedarse en casa esta noche.",
    ingredients: ["2× Philadelphia", "2× Acevichado", "Chicha morada 500 ml"],
    spice: 1,
    badges: ["bestseller"],
    image: assetPath("/images/products/platter.jpg"),
    featured: true,
    rating: 4.9,
  },
  {
    slug: "combo-familiar",
    name: "Combo Familiar",
    jp: "家族 · 宴会",
    category: "combo",
    price: 139,
    oldPrice: 172,
    pieces: 32,
    description:
      "32 piezas de nuestros cuatro rolls más pedidos + bebida de 1.5 L. Para la mesa completa, la reunión o el hambre seria.",
    ingredients: ["4× Philadelphia", "4× Acevichado", "2× Dragon", "2× Furikake Sake", "Bebida 1.5 L"],
    spice: 1,
    badges: ["bestseller"],
    image: assetPath("/images/products/platter.jpg"),
    rating: 4.9,
  },
  {
    slug: "maki-lovers",
    name: "Maki Lovers",
    jp: "愛 · 巻き",
    category: "combo",
    price: 99,
    oldPrice: 118,
    pieces: 24,
    description:
      "24 piezas: lo mejor de especiales y furikake, con dorayaki de lúcuma de cortesía. Para quienes vienen con hambre de amor propio.",
    ingredients: ["2× Nikkei Roll", "2× Furikake Sake", "2× Tempurizado", "Dorayaki de regalo"],
    spice: 1,
    badges: ["nuevo"],
    image: assetPath("/images/products/platter.jpg"),
    rating: 4.8,
  },
];

export const TESTIMONIALS = [
  {
    name: "Valeria Contreras",
    district: "Miraflores",
    text: "El Acevichado es una obra de arte: crocante, ácido, picante en el punto. Pedí un martes a las 8 y llegó en 25 minutos, presentación de restaurante con estrella.",
    rating: 5,
  },
  {
    name: "André Quiroz",
    district: "San Isidro",
    text: "Probé makis en Maido, en Osaka, en todo Lima. El Furikake Sake de SUMI se para en la misma mesa. La chicha morada con maki nikkei es otro nivel.",
    rating: 5,
  },
  {
    name: "Camila Ferreyros",
    district: "Barranco",
    text: "Pedí el Combo Pareja para aniversario. Llegó con caja lacada, tarjeta escrita a mano y todo impecable. Mi polso no dejó de hablar del dragon roll.",
    rating: 5,
  },
  {
    name: "Rodrigo Salazar",
    district: "Surco",
    text: "Soy cliente de hace dos años. Nunca, ni una sola vez, me llegó un maki tibio o un arroz pasado. Esa consistencia es lo que cuesta encontrar.",
    rating: 5,
  },
];

export const STATS = [
  { value: 12, suffix: "", label: "Años perfeccionando el arroz" },
  { value: 480, suffix: "K", label: "Makis servidos desde 2014" },
  { value: 4.9, suffix: "★", label: "Rating promedio · 3.2K reseñas", decimals: 1 },
  { value: 25, suffix: " min", label: "Delivery promedio en Lima" },
];

export const SITE = {
  name: "SUMI",
  tagline: "El arte del maki, alma nikkei",
  address: "Av. Diagonal 518, Miraflores",
  city: "Lima, Perú",
  phone: "+51 987 654 321",
  whatsapp: "51987654321",
  hours: [
    { days: "Martes a Jueves", time: "13:00 — 23:00" },
    { days: "Viernes y Sábado", time: "13:00 — 00:00" },
    { days: "Domingo", time: "13:00 — 22:00" },
    { days: "Lunes", time: "Cerrado · día de mercado" },
  ],
  deliveryFee: 8,
  freeDeliveryFrom: 90,
  zones: ["Miraflores", "San Isidro", "Barranco", "Surco", "San Borja", "La Molina", "Lince", "Jesús María"],
};

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(n: number): string {
  return `S/ ${n.toFixed(2).replace(/\.00$/, "")}`;
}
