"use client";

import { Button } from "@/components/ui/button";
import { deleteArtisan } from "@/features/shop/actions/delete-artisan.action";

interface ArtisansTableProps {
  artisans: Array<{
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
  }>;
}

export function ArtisansTable({ artisans }: ArtisansTableProps) {
  async function onDelete(id: string) {
    const confirmed = window.confirm(
      "Supprimer cet artisan ? Les produits liés auront artisanId à null."
    );
    if (!confirmed) return;
    await deleteArtisan(id);
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-left">Nom</th>
            <th className="px-3 py-2 text-left">Slug</th>
            <th className="px-3 py-2 text-left">Produits</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {artisans.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="px-3 py-2">{a.name}</td>
              <td className="px-3 py-2">{a.slug}</td>
              <td className="px-3 py-2">{a._count.products}</td>
              <td className="px-3 py-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(a.id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
