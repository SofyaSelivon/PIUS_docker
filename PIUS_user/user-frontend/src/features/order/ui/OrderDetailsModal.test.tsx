import { render, screen } from "@testing-library/react";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { describe, test, expect } from "vitest";

describe("OrderDetailsModal", () => {
  const order = {
    orderId: "12345678abcd",
    deliveryCity: "Москва",
    deliveryAddress: "ул. Пушкина",
    totalPrice: 2000,
    markets: [
      {
        marketId: "1",
        marketName: "Магазин 1",
        status: "completed",
        items: [
          {
            productId: "p1",
            name: "Товар 1",
            quantity: 2,
            priceAtPurchase: 500,
          },
        ],
      },
    ],
  };

  test("не рендерится без заказа", () => {
    const { container } = render(
      <OrderDetailsModal order={null} open={true} onClose={() => {}} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("рендер деталей заказа", () => {
    render(
      <OrderDetailsModal order={order} open={true} onClose={() => {}} />
    );

    expect(screen.getByText(/заказ/i)).toBeInTheDocument();
    expect(screen.getByText(/москва/i)).toBeInTheDocument();
    expect(screen.getByText(/товар 1/i)).toBeInTheDocument();
    expect(screen.getByText(/500/i)).toBeInTheDocument();
  });

  test("общая сумма отображается", () => {
    render(
      <OrderDetailsModal order={order} open={true} onClose={() => {}} />
    );

    expect(screen.getByText(/2000/i)).toBeInTheDocument();
  });
});
