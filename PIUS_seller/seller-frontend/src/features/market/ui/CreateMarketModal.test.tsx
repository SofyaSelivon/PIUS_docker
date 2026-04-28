import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateMarketModal } from "./CreateMarketModal";

const unwrapMock = vi.fn();
const createMarketMock = vi.fn();

vi.mock("../../../entities/market/api/marketApi", () => ({
  useCreateMarketMutation: () => [
    createMarketMock,
    { isLoading: false },
  ],
}));

describe("CreateMarketModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal", () => {
    render(
      <CreateMarketModal
        open
        onSuccess={vi.fn()}
      />
    );

    expect(
      screen.getByText("Создание магазина")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Название магазина")
    ).toBeInTheDocument();
  });

  it("updates input", () => {
    render(
      <CreateMarketModal
        open
        onSuccess={vi.fn()}
      />
    );

    fireEvent.change(
      screen.getByLabelText("Название магазина"),
      {
        target: { value: "My Market" },
      }
    );

    expect(
      screen.getByDisplayValue("My Market")
    ).toBeInTheDocument();
  });

  it("submits market creation", async () => {
    unwrapMock.mockResolvedValue({});
    createMarketMock.mockReturnValue({
      unwrap: unwrapMock,
    });

    const onSuccess = vi.fn();

    render(
      <CreateMarketModal
        open
        onSuccess={onSuccess}
      />
    );

    fireEvent.change(
      screen.getByLabelText("Название магазина"),
      {
        target: { value: "Store 1" },
      }
    );

    fireEvent.click(
      screen.getByText("Подтвердить")
    );

    await waitFor(() => {
      expect(createMarketMock).toHaveBeenCalledWith({
        marketName: "Store 1",
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("does not submit empty name", () => {
    render(
      <CreateMarketModal
        open
        onSuccess={vi.fn()}
      />
    );

    fireEvent.click(
      screen.getByText("Подтвердить")
    );

    expect(createMarketMock).not.toHaveBeenCalled();
  });

  it("handles api error", async () => {
    const error = new Error("fail");

    vi.spyOn(console, "error").mockImplementation(() => {});

    unwrapMock.mockRejectedValue(error);

    createMarketMock.mockReturnValue({
      unwrap: unwrapMock,
    });

    render(
      <CreateMarketModal
        open
        onSuccess={vi.fn()}
      />
    );

    fireEvent.change(
      screen.getByLabelText("Название магазина"),
      {
        target: { value: "Store" },
      }
    );

    fireEvent.click(
      screen.getByText("Подтвердить")
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});