import { ProductList, getProducts } from "@/modules/products";

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <main>
      <h1>Products</h1>
      <ProductList products={products} />
    </main>
  );
}
