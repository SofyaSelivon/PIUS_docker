import { render, screen, fireEvent } from "@testing-library/react";
import { CartList } from "./CartList";
import { describe, test, expect, vi } from "vitest";

vi.mock("../../../entities/cart/ui/CartItemCard", () => ({
  CartItemCard: ({ item, onIncrease, onDecrease, onDelete }: any) => (
    <div>
      <span>{item.name}</span>
      <button onClick={onIncrease}>increase-{item.productId}</button>
      <button onClick={onDecrease}>decrease-{item.productId}</button>
      <button onClick={onDelete}>delete-{item.productId}</button>
    </div>
  ),
}));

describe("CartList", () => {
  const items = [
    { productId: "1", name: "iPhone", price: 1000, quantity: 2 },
    { productId: "2", name: "Samsung", price: 500, quantity: 1 },
  ];

  test("рендерит список товаров и итог", () => {
    render(
      <CartList
        items={items}
        totalPrice={2500}
        onIncrease={() => {}}
        onDecrease={() => {}
        }
        onDelete={() => {}}
        onCheckout={() => {}}
      />
    );

    expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    expect(screen.getByText(/samsung/i)).toBeInTheDocument();
    expect(screen.getByText(/2500/i)).toBeInTheDocument();
  });

  test("increase вызывает callback с правильным id", () => {
    const onIncrease = vi.fn();

    render(
      <CartList
        items={items}
        totalPrice={2500}
        onIncrease={onIncrease}
        onDecrease={() => {}}
        onDelete={() => {}}
        onCheckout={() => {}}
      />
    );

    fireEvent.click(screen.getByText("increase-1"));

    expect(onIncrease).toHaveBeenCalledWith("1");
  });

  test("decrease вызывает callback с правильным id", () => {
    const onDecrease = vi.fn();

    render(
      <CartList
        items={items}
        totalPrice={2500}
        onIncrease={() => {}}
        onDecrease={onDecrease}
        onDelete={() => {}}
        onCheckout={() => {}}
      />
    );

    fireEvent.click(screen.getByText("decrease-2"));

    expect(onDecrease).toHaveBeenCalledWith("2");
  });

  test("delete вызывает callback с правильным id", () => {
    const onDelete = vi.fn();

    render(
      <CartList
        items={items}
        totalPrice={2500}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onDelete={onDelete}
        onCheckout={() => {}}
      />
    );

    fireEvent.click(screen.getByText("delete-1"));

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  test("кнопка оформления вызывает onCheckout", () => {
    const onCheckout = vi.fn();

    render(
      <CartList
        items={items}
        totalPrice={2500}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onDelete={() => {}}
        onCheckout={onCheckout}
      />
    );

    fireEvent.click(screen.getByText(/оформить заказ/i));

    expect(onCheckout).toHaveBeenCalled();
  });

  test("пустая корзина корректно рендерится", () => {
    render(
      <CartList
        items={[]}
        totalPrice={0}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onDelete={() => {}}
        onCheckout={() => {}}
      />
    );

    expect(screen.getByText(/0/i)).toBeInTheDocument();
  });
});