import "server-only";
import type { Order } from "../types";

// In-memory fixture data standing in for a real data source (DB/API).
const ORDERS: Order[] = [
  {
    id: "o1",
    lines: [
      { productId: "p1", quantity: 1 },
      { productId: "p3", quantity: 2 },
    ],
  },
];

export async function getOrders(): Promise<Order[]> {
  return ORDERS;
}
