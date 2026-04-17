import { render, screen, fireEvent } from "@testing-library/react";
import { OrderCard } from "./OrderCard";
import { describe, test, expect, vi } from "vitest";

describe("OrderCard", () => {
  const order = {
    orderId: "12345678abcd",
    createdAt: new Date().toISOString(),
    status: "completed",
    totalPrice: 1500,
    totalItems: 3,
  };

  test("рендер данных заказа", () => {
    render(<OrderCard order={order} onClick={() => {}} />);

    expect(screen.getByText(/12345678/i)).toBeInTheDocument();
    expect(screen.getByText(/1500/i)).toBeInTheDocument();
    expect(screen.getByText(/товаров: 3/i)).toBeInTheDocument();
  });

  test("клик по кнопке вызывает onClick", () => {
    const onClick = vi.fn();

    render(<OrderCard order={order} onClick={onClick} />);

    fireEvent.click(screen.getByText(/подробнее/i));

    expect(onClick).toHaveBeenCalled();
  });
});