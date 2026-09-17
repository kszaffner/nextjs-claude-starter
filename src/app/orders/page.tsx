import { OrderSummary, getOrders } from "@/modules/orders";

export default async function OrdersPage() {
  const orders = await getOrders();
  return (
    <main>
      <h1>Orders</h1>
      {orders.map((order) => (
        <OrderSummary key={order.id} order={order} />
      ))}
    </main>
  );
}
