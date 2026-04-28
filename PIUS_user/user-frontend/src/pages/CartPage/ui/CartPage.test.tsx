import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CartPage } from "./CartPage";
import { describe, test, expect, vi } from "vitest";

const mockUpdate = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));

const mockRemove = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));

vi.mock("../../../entities/cart/api/cartApi", () => ({
  useGetCartQuery: () => ({
    data: {
      items: [
        {
          productId: "1",
          name: "iPhone",
          price: 1000,
          quantity: 2,
          available: 5,
          img: "img.png",
        },
      ],
    },
    isLoading: false,
  }),
  useUpdateCartItemMutation: () => [mockUpdate],
  useRemoveCartItemMutation: () => [mockRemove],
}));

vi.mock("../../../widgets/cart/ui/CartList", () => ({
  CartList: ({ onIncrease, onDecrease, onDelete, onCheckout }: any) => (
    <div>
      <button onClick={() => onIncrease("1")}>inc</button>
      <button onClick={() => onDecrease("1")}>dec</button>
      <button onClick={() => onDelete("1")}>del</button>
      <button onClick={onCheckout}>checkout</button>
    </div>
  ),
}));

vi.mock("../../../features/order/ui/CreateOrderModal", () => ({
  CreateOrderModal: ({ open }: any) =>
    open ? <div>Modal Open</div> : null,
}));

describe("CartPage", () => {
  test("увеличение количества", async () => {
    render(<CartPage />);

    fireEvent.click(screen.getByText("inc"));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        productId: "1",
        quantity: 3,
      });
    });
  });

  test("уменьшение количества", async () => {
    render(<CartPage />);

    fireEvent.click(screen.getByText("dec"));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        productId: "1",
        quantity: 1,
      });
    });
  });

  test("удаление товара", async () => {
    render(<CartPage />);

    fireEvent.click(screen.getByText("del"));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith("1");
    });
  });

  test("открытие модалки оформления", async () => {
    render(<CartPage />);

    fireEvent.click(screen.getByText("checkout"));

    await waitFor(() => {
      expect(screen.getByText("Modal Open")).toBeInTheDocument();
    });
  });
});
