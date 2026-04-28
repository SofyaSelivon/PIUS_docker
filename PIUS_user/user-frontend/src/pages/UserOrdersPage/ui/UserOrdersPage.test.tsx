import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { UserOrdersPage } from "./UserOrdersPage";

const mockDetailsQuery = vi.fn();
const mockOrdersQuery = vi.fn();

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
  useGetOrdersQuery: () => mockOrdersQuery(),
  useGetOrderDetailsQuery: (...args: any[]) => mockDetailsQuery(...args),
}));

vi.mock("../../../entities/order/ui/OrderCard", () => ({
  OrderCard: ({ order, onClick }: any) => (
    <div onClick={onClick}>Order {order.orderId}</div>
  ),
}));

vi.mock("../../../features/order/ui/OrderDetailsModal", () => ({
  OrderDetailsModal: ({ open, onClose }: any) =>
    open ? (
      <div>
        Modal Open
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe("UserOrdersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockOrdersQuery.mockReturnValue({
      data: { orders: mockOrders },
    });

    mockDetailsQuery.mockReturnValue({
      data: null,
    });
  });

  test("рендер заказов", () => {
    render(<UserOrdersPage />);

    expect(screen.getByText(/Order 12345678abcd/i)).toBeInTheDocument();
  });

  test("модалка закрыта по умолчанию", () => {
    render(<UserOrdersPage />);

    expect(screen.queryByText("Modal Open")).not.toBeInTheDocument();
  });

  test("открытие модалки при клике", async () => {
    mockDetailsQuery.mockReturnValue({ data: mockDetails });

    render(<UserOrdersPage />);

    fireEvent.click(screen.getByText(/Order 12345678abcd/i));

    await waitFor(() => {
      expect(screen.getByText("Modal Open")).toBeInTheDocument();
    });
  });

  test("закрытие модалки", async () => {
    mockDetailsQuery.mockReturnValue({ data: mockDetails });

    render(<UserOrdersPage />);

    fireEvent.click(screen.getByText(/Order 12345678abcd/i));

    await screen.findByText("Modal Open");

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(screen.queryByText("Modal Open")).not.toBeInTheDocument();
    });
  });

  test("нет заказов — ничего не рендерится", () => {
    mockOrdersQuery.mockReturnValue({
      data: undefined,
    });

    render(<UserOrdersPage />);

    expect(screen.queryByText(/Order/i)).not.toBeInTheDocument();
  });

  test("details query вызывается с skip=true без selectedId", () => {
    render(<UserOrdersPage />);

    expect(mockDetailsQuery).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ skip: true })
    );
  });
});