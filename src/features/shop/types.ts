export interface Artisan {
  id: string;
  slug: string;
  name: string;
  bio: string;
  avatarUrl?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string | null;
  category: "merch" | "artisan";
  artisanId?: string | null;
}

