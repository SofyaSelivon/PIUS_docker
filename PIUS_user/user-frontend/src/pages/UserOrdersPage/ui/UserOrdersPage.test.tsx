import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserOrdersPage } from "./UserOrdersPage";
import { describe, test, expect, vi } from "vitest";

const mockOrders = [
  {
    orderId: "12345678abcd",
    createdAt: new Date().toISOString(),
    status: "generated",
    totalPrice: 1000,
    totalItems: 2,
  },
];

const mockDetails = {
  orderId: "12345678abcd",
  deliveryCity: "Москва",
  deliveryAddress: "ул. Пушкина",
  totalPrice: 1000,
  markets: [],
};

vi.mock("../../../entities/order/api/orderApi", () => ({
  useGetOrdersQuery: () => ({
    data: { orders: mockOrders },
  }),
  useGetOrderDetailsQuery: vi.fn(),
}));

vi.mock("../../../entities/order/ui/OrderCard", () => ({
  OrderCard: ({ order, onClick }: any) => (
    <div onClick={onClick}>Order {order.orderId}</div>
  ),
}));

vi.mock("../../../features/order/ui/OrderDetailsModal", () => ({
  OrderDetailsModal: ({ open }: any) =>
    open ? <div>Modal Open</div> : null,
}));

import { useGetOrderDetailsQuery } from "../../../entities/order/api/orderApi";

describe("UserOrdersPage", () => {
  test("рендер заказов", () => {
    (useGetOrderDetailsQuery as any).mockReturnValue({
      data: null,
    });

    render(<UserOrdersPage />);

    expect(screen.getByText(/Order 12345678abcd/i)).toBeInTheDocument();
  });

  test("открытие модалки при клике", async () => {
    (useGetOrderDetailsQuery as any).mockReturnValue({
      data: mockDetails,
    });

    render(<UserOrdersPage />);

    fireEvent.click(screen.getByText(/Order 12345678abcd/i));

    await waitFor(() => {
      expect(screen.getByText("Modal Open")).toBeInTheDocument();
    });
  });
});