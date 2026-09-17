// Public API of the products module.
// Consumers (app routes, other modules) must import only from this file —
// never from `products/components/*`, `products/server/*` directly.

export { ProductCard } from "./components/ProductCard";
export { ProductList } from "./components/ProductList";
export { getProductById, getProducts } from "./server/getProducts";
export type { Product } from "./types";
