"use client";

import { Artisan, Product } from "../types";
import { ArtisanCard } from "./artisan-card";
import { ProductCard } from "./product-card";

interface ShopListsProps {
  artisans: Artisan[];
  merch: Product[];
  artisanProducts: Product[];
}

export function ShopLists({
  artisans,
  merch,
  artisanProducts,
}: ShopListsProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-semibold mb-4">Artisans de Meudon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artisans.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Merch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {merch.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Produits d'artisans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artisanProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

