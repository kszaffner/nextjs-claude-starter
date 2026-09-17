"use client";

import { useMemo, useState } from "react";
import { Button } from "@/shared/ui/Button";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

type CategoryFilter = "all" | Product["category"];

export function ProductList({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filteredProducts = useMemo(() => {
    if (category === "all") return products;
    return products.filter((product) => product.category === category);
  }, [products, category]);

  return (
    <div className="product-list">
      <div className="product-list__filters" role="group" aria-label="Filter products by category">
        {(["all", "electronics", "home", "apparel"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant={category === value ? "primary" : "secondary"}
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="product-list__items">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
