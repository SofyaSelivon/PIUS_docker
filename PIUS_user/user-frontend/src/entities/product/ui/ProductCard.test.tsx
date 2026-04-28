import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import { describe, test, expect, vi } from "vitest";

const mockAdd = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));

vi.mock("../../cart/api/cartApi", () => ({
  useAddToCartMutation: () => [mockAdd, { isLoading: false }],
}));

describe("ProductCard", () => {
  const product = {
    id: "1",
    name: "iPhone",
    price: 1000,
    img: "img.png",
    available: 10,
  };

  test("рендер данных", () => {
    render(<ProductCard product={product} onOpen={() => {}} />);

    expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
  });

  test("добавление в корзину", async () => {
    render(<ProductCard product={product} onOpen={() => {}} />);

    fireEvent.click(screen.getByText(/добавить в корзину/i));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalled();
    });
  });

  test("кнопка disabled если нет товара", () => {
    render(
      <ProductCard
        product={{ ...product, available: 0 }}
        onOpen={() => {}}
      />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
