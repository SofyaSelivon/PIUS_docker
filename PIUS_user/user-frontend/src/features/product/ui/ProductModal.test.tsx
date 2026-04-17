import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductModal } from "./ProductModal";
import { describe, test, expect, vi } from "vitest";

const mockAdd = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));

vi.mock("../../../entities/cart/api/cartApi", () => ({
  useAddToCartMutation: () => [mockAdd, { isLoading: false }],
}));

describe("ProductModal", () => {
  const product = {
    id: "1",
    name: "iPhone",
    description: "desc",
    category: "electronics",
    available: 5,
    img: "img.png",
  };

  test("не рендерится без продукта", () => {
    const { container } = render(
      <ProductModal product={null} open={true} onClose={() => {}} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("рендер продукта", () => {
    render(
      <ProductModal product={product} open={true} onClose={() => {}} />
    );

    expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    expect(screen.getByText(/desc/i)).toBeInTheDocument();
  });

  test("добавление в корзину", async () => {
    render(
      <ProductModal product={product} open={true} onClose={() => {}} />
    );

    fireEvent.click(screen.getByText(/добавить/i));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalled();
    });
  });
});