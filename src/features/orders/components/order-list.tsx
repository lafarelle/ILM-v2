"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/format";
import Link from "next/link";

interface OrderItemLite {
  id: string;
  unitPriceCents: number;
  quantity: number;
  product?: { name: string | null } | null;
}

interface OrderLite {
  id: string;
  createdAt: string | Date;
  totalCents: number;
  status: string;
  items: OrderItemLite[];
}

interface OrderListProps {
  orders: OrderLite[];
}

export function OrderList({ orders }: OrderListProps) {
  if (!orders?.length) return null;

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>
                Commande <span className="font-mono">#{order.id}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                {formatPrice(order.totalCents)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1 text-sm text-muted-foreground">
              <div>
                Statut: <span className="uppercase">{order.status}</span>
              </div>
              <div>
                {order.items.map((i) => (
                  <div key={i.id} className="flex justify-between">
                    <span className="truncate mr-2">
                      {i.product?.name ?? "Article"}
                    </span>
                    <span>
                      {formatPrice(i.unitPriceCents)} × {i.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link href={`/profile`}>Voir détails</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
