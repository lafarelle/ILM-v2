"use client";

import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/features/shop/actions/delete-product.action";

interface ProductsTableProps {
  products: Array<{
    id: string;
    name: string;
    category: string;
    artisan?: { name: string } | null;
  }>;
}

export function ProductsTable({ products }: ProductsTableProps) {
  async function onDelete(id: string) {
    const confirmed = window.confirm("Supprimer ce produit ?");
    if (!confirmed) return;
    await deleteProduct(id);
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-left">Nom</th>
            <th className="px-3 py-2 text-left">Catégorie</th>
            <th className="px-3 py-2 text-left">Artisan</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="px-3 py-2">{p.name}</td>
              <td className="px-3 py-2">{p.category}</td>
              <td className="px-3 py-2">{p.artisan?.name ?? "—"}</td>
              <td className="px-3 py-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(p.id)}
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
