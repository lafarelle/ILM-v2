"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../types";

function formatPrice(priceCents: number): string {
  const euros = priceCents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(euros);
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.slug}`} className="group">
      <Card className="overflow-hidden transition-transform group-hover:-translate-y-0.5">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>{product.name}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {formatPrice(product.priceCents)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 items-start">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={96}
              height={96}
              className="rounded-md object-cover"
            />
          ) : null}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

