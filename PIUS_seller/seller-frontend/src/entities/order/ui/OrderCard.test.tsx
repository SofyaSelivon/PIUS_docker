import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OrderCard } from "./OrderCard";
import { describe, test, expect, vi } from "vitest";

const mockUpdate = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));

const mockDelete = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));

vi.mock("../api/orderApi", () => ({
  useUpdateOrderStatusMutation: () => [mockUpdate],
  useDeleteOrderMutation: () => [mockDelete],
}));

vi.mock("../../../features/order/ui/OrderModal", () => ({
  OrderModal: () => <div>Modal</div>,
}));

describe("OrderCard", () => {
  const order = {
    id: "1",
    orderNumber: "123",
    totalAmount: 1000,
    deliveryAddress: "Москва",
    status: "NEW",
    user: { telegram: "testuser" },
  };

  test("отображает данные заказа", () => {
    render(<OrderCard order={order} />);

    expect(screen.getByText(/123/)).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });

  test("изменение статуса вызывает API", async () => {
    render(<OrderCard order={order} />);

    fireEvent.mouseDown(screen.getByLabelText(/статус/i));
    fireEvent.click(screen.getAllByRole("option")[0]);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  test("удаление заказа", async () => {
    window.confirm = vi.fn(() => true);

    render(<OrderCard order={order} />);

    const buttons = screen.getAllByRole("button");
    const deleteBtn = buttons[1];

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(order.id);
    });
  });

  test("открытие telegram", () => {
    window.open = vi.fn();

    render(<OrderCard order={order} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // telegram button

    expect(window.open).toHaveBeenCalledWith(
      "https://t.me/testuser",
      "_blank"
    );
  });

  test("shows alert when status update fails", async () => {
    window.alert = vi.fn();

    mockUpdate.mockImplementation(() => ({
      unwrap: () =>
        Promise.reject({
          data: {
            detail: "update failed",
          },
        }),
    }));

    render(<OrderCard order={order} />);

    fireEvent.mouseDown(
      screen.getByLabelText(/статус/i)
    );

    fireEvent.click(
      screen.getAllByRole("option")[0]
    );

    await waitFor(() => {
      expect(window.alert)
        .toHaveBeenCalledWith(
          "update failed"
        );
    });
  });

  test("does not delete when confirm cancelled", () => {
    mockDelete.mockClear();

    window.confirm = vi.fn(() => false);

    render(
      <OrderCard order={order} />
    );

    fireEvent.click(
      screen.getAllByRole("button")[1]
    );

    expect(window.confirm)
      .toHaveBeenCalled();

    expect(mockDelete)
      .not.toHaveBeenCalled();
  });

  test("shows alert on delete failure", async () => {
    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();

    mockDelete.mockImplementation(() => ({
      unwrap: () => Promise.reject(),
    }));

    render(
      <OrderCard order={order} />
    );

    fireEvent.click(
      screen.getAllByRole("button")[1]
    );

    await waitFor(() => {
      expect(window.alert)
        .toHaveBeenCalledWith(
          "Ошибка удаления"
        );
    });
  });

  test("shows alert when telegram missing", () => {
    window.alert = vi.fn();

    render(
      <OrderCard
        order={{
          ...order,
          user: {},
        }}
      />
    );

    fireEvent.click(
      screen.getAllByRole("button")[0]
    );

    expect(window.alert)
      .toHaveBeenCalledWith(
        "Нет telegram"
      );
  });
});
