import { render, screen, fireEvent } from "@testing-library/react";
import { CartList } from "./CartList";
import { describe, test, expect, vi } from "vitest";

vi.mock("../../../entities/cart/ui/CartItemCard", () => ({
  CartItemCard: ({ item, onIncrease, onDecrease, onDelete }: any) => (
    <div>
      <span>{item.name}</span>
      <button onClick={onIncrease}>+</button>
      <button onClick={onDecrease}>-</button>
      <button onClick={onDelete}>x</button>
    </div>
  ),
}));

describe("CartList", () => {
  const items = [
    { productId: "1", name: "iPhone", price: 1000, quantity: 2 },
  ];

  test("рендерит товары и итог", () => {
    render(
      <CartList
        items={items}
        totalPrice={2000}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onDelete={() => {}}
        onCheckout={() => {}}
      />
    );

    expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    expect(screen.getByText(/2000/i)).toBeInTheDocument();
  });

  test("кнопка оформления вызывает callback", () => {
    const onCheckout = vi.fn();

    render(
      <CartList
        items={items}
        totalPrice={2000}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onDelete={() => {}}
        onCheckout={onCheckout}
      />
    );

    fireEvent.click(screen.getByText(/оформить заказ/i));

    expect(onCheckout).toHaveBeenCalled();
  });
});
