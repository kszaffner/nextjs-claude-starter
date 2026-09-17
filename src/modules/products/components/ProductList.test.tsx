import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Product } from "../types";
import { ProductList } from "./ProductList";

const products: Product[] = [
  { id: "p1", name: "Headphones", category: "electronics", priceInCents: 1000 },
  { id: "p2", name: "Mug", category: "home", priceInCents: 500 },
];

describe("ProductList", () => {
  it("renders all products by default", () => {
    render(<ProductList products={products} />);
    expect(screen.getByText("Headphones")).toBeInTheDocument();
    expect(screen.getByText("Mug")).toBeInTheDocument();
  });

  it("filters products by category", () => {
    render(<ProductList products={products} />);
    fireEvent.click(screen.getByRole("button", { name: "home" }));
    expect(screen.queryByText("Headphones")).not.toBeInTheDocument();
    expect(screen.getByText("Mug")).toBeInTheDocument();
  });
});
