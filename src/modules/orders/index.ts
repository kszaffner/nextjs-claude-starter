// Public API of the orders module.
// Consumers must import only from this file — never from
// `orders/components/*` or `orders/server/*` directly.

export { OrderSummary } from "./components/OrderSummary";
export { getOrders } from "./server/getOrders";
export type { Order, OrderLine } from "./types";
