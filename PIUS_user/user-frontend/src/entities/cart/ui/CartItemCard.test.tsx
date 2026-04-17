import { render, screen, fireEvent } from "@testing-library/react";
import { CartItemCard } from "./CartItemCard";
import { describe, test, expect, vi } from "vitest";

describe("CartItemCard", () => {
  const item = {
    productId: "1",
    name: "iPhone",
    price: 1000,
    quantity: 2,
    available: 5,
    img: "img.png",
  };

  test("рендер данных", () => {
    render(
      <CartItemCard
        item={item}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
  });

  test("увеличение количества", () => {
    const onIncrease = vi.fn();

    render(
      <CartItemCard
        item={item}
        onIncrease={onIncrease}
        onDecrease={() => {}}
        onDelete={() => {}}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[1]); // +
    expect(onIncrease).toHaveBeenCalled();
  });

  test("уменьшение количества", () => {
    const onDecrease = vi.fn();

    render(
      <CartItemCard
        item={item}
        onIncrease={() => {}}
        onDecrease={onDecrease}
        onDelete={() => {}}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[0]); // -
    expect(onDecrease).toHaveBeenCalled();
  });

  test("удаление товара", () => {
    const onDelete = vi.fn();

    render(
      <CartItemCard
        item={item}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[2]); // delete
    expect(onDelete).toHaveBeenCalled();
  });
});