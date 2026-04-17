import { render, screen, fireEvent } from "@testing-library/react";
import { ProductList } from "./ProductList";
import { describe, test, expect, vi } from "vitest";

vi.mock("./ProductCard", () => ({
  ProductCard: ({ product, onOpen }: any) => (
    <div onClick={onOpen}>Product {product.name}</div>
  ),
}));

describe("ProductList", () => {
  const products = [
    { id: "1", name: "iPhone" },
    { id: "2", name: "Samsung" },
  ];

  test("рендерит продукты", () => {
    render(
      <ProductList
        products={products}
        page={1}
        totalPages={3}
        onPageChange={() => {}}
        onOpen={() => {}}
      />
    );

    expect(screen.getByText(/iPhone/i)).toBeInTheDocument();
    expect(screen.getByText(/Samsung/i)).toBeInTheDocument();
  });

  test("смена страницы", () => {
    const onPageChange = vi.fn();

    render(
      <ProductList
        products={products}
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
        onOpen={() => {}}
      />
    );

    const pageBtn = screen.getByRole("button", {
      name: /go to page 2/i,
    });

    fireEvent.click(pageBtn);

expect(onPageChange).toHaveBeenCalledWith(2);
  });
});