"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Artisan } from "../types";

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <Link href={`/shop/${artisan.slug}`} className="group">
      <Card className="overflow-hidden transition-transform group-hover:-translate-y-0.5">
        <CardHeader>
          <CardTitle className="text-base">{artisan.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 items-start">
          {artisan.avatarUrl ? (
            <Image
              src={artisan.avatarUrl}
              alt={artisan.name}
              width={64}
              height={64}
              className="rounded-md object-cover"
            />
          ) : null}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {artisan.bio}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

