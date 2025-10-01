import { Artisan, Product } from "../types";

export const artisans: Artisan[] = [
  {
    id: "a1",
    slug: "boulangerie-meudonnaise",
    name: "Boulangerie Meudonnaise",
    bio: "Artisan boulanger proposant pains au levain et viennoiseries locales.",
    avatarUrl: "/images/artisans/nayoum.png",
  },
  {
    id: "a2",
    slug: "atelier-ceramique",
    name: "Atelier Céramique",
    bio: "Pièces uniques faites main: tasses, bols et vases.",
    avatarUrl: "/images/artisans/nayoum.png",
  },
];

export const products: Product[] = [
  // Merch
  {
    id: "m1",
    slug: "tshirt-i-love-meudon",
    name: "T-shirt I Love Meudon",
    description: "Coton bio, coupe unisexe, sérigraphie cœur Meudon.",
    priceCents: 2500,
    category: "merch",
    imageUrl: "/images/artisans/nayoum.png",
  },
  {
    id: "m2",
    slug: "tshirt-meudon-foret",
    name: "T-shirt Forêt de Meudon",
    description: "Illustration de la forêt de Meudon.",
    priceCents: 2800,
    category: "merch",
    imageUrl: "/images/artisans/nayoum.png",
  },
  {
    id: "m3",
    slug: "mug-i-love-meudon",
    name: "Mug I Love Meudon",
    description: "Céramique blanche, impression durable.",
    priceCents: 1500,
    category: "merch",
    imageUrl: "/images/artisans/nayoum.png",
  },
  // Artisan products
  {
    id: "p1",
    slug: "baguette-tradition",
    name: "Baguette Tradition",
    description: "Farine locale, fermentation lente.",
    priceCents: 130,
    category: "artisan",
    artisanId: "a1",
    imageUrl: "/images/artisans/nayoum.png",
  },
  {
    id: "p2",
    slug: "tasse-emaillée",
    name: "Tasse émaillée",
    description: "Fait main à l'atelier, pièce unique.",
    priceCents: 3500,
    category: "artisan",
    artisanId: "a2",
    imageUrl: "/images/artisans/nayoum.png",
  },
];

export function getArtisanBySlug(slug: string): Artisan | undefined {
  return artisans.find((a) => a.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
