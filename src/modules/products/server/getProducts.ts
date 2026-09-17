import "server-only";
import type { Product } from "../types";

// In-memory fixture data standing in for a real data source (DB/API).
// Replace with a real query when this module needs one.
const PRODUCTS: Product[] = [
  { id: "p1", name: "Wireless Headphones", category: "electronics", priceInCents: 8999 },
  { id: "p2", name: "Ceramic Mug", category: "home", priceInCents: 1499 },
  { id: "p3", name: "Cotton T-Shirt", category: "apparel", priceInCents: 2499 },
  { id: "p4", name: "Mechanical Keyboard", category: "electronics", priceInCents: 12999 },
];

export async function getProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return PRODUCTS.find((product) => product.id === id);
}
