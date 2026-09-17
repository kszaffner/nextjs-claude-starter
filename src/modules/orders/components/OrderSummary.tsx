import { formatCurrency } from "@/shared/lib/formatCurrency";
import { getProductById } from "@/modules/products";
import type { Order } from "../types";

// Orders legitimately depends on the products module's public API to
// resolve product details for each order line. This is an allowed
// module -> module dependency because it reflects a real business
// relationship (an order references products).
export async function OrderSummary({ order }: { order: Order }) {
  const lines = await Promise.all(
    order.lines.map(async (line) => {
      const product = await getProductById(line.productId);
      return { line, product };
    }),
  );

  const totalInCents = lines.reduce(
    (sum, { line, product }) => sum + (product?.priceInCents ?? 0) * line.quantity,
    0,
  );

  return (
    <section className="order-summary">
      <h3>Order {order.id}</h3>
      <ul>
        {lines.map(({ line, product }) => (
          <li key={line.productId}>
            {product?.name ?? "Unknown product"} × {line.quantity}
          </li>
        ))}
      </ul>
      <p>Total: {formatCurrency(totalInCents)}</p>
    </section>
  );
}
