import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateOrderModal } from "./CreateOrderModal";
import { describe, test, expect, vi } from "vitest";

const mockCreate = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));

vi.mock("../../../entities/order/api/orderApi", () => ({
  useCreateOrderMutation: () => [mockCreate, { isLoading: false }],
}));

describe("CreateOrderModal", () => {
  test("валидация формы", async () => {
    render(<CreateOrderModal open={true} onClose={() => {}} />);

    fireEvent.click(screen.getByText(/подтвердить/i));

    await waitFor(() => {
      expect(screen.getByText(/адрес должен/i)).toBeInTheDocument();
    });
  });

  test("успешное создание заказа", async () => {
    const onClose = vi.fn();

    render(<CreateOrderModal open={true} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText(/город/i), {
      target: { value: "Москва" },
    });

    fireEvent.change(screen.getByLabelText(/адрес/i), {
      target: { value: "ул. Пушкина 10" },
    });

    fireEvent.change(screen.getByLabelText(/телефон/i), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByText(/подтвердить/i));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
