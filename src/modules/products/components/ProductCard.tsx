import { formatCurrency } from "@/shared/lib/formatCurrency";
import type { Product } from "../types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>{formatCurrency(product.priceInCents)}</p>
    </article>
  );
}
