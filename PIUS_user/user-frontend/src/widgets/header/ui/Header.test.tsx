import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";
import { describe, test, expect, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Header", () => {
  test("отображает имя пользователя", () => {
    render(<Header cartCount={3} userName="Анастасия" />);

    expect(screen.getByText("Анастасия")).toBeInTheDocument();
  });

  test("отображает количество товаров в корзине", () => {
    render(<Header cartCount={5} userName="User" />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("навигация по кнопкам", () => {
    render(<Header cartCount={1} userName="User" />);

    fireEvent.click(screen.getByText(/главная/i));
    expect(mockNavigate).toHaveBeenCalledWith("/");

    fireEvent.click(screen.getByText(/заказы/i));
    expect(mockNavigate).toHaveBeenCalledWith("/orders");
  });

  test("переход в корзину", () => {
    render(<Header cartCount={2} userName="User" />);

    // Badge внутри IconButton → берём по иконке
    const cartIcon = screen.getByTestId("ShoppingCartIcon").closest("button");

    fireEvent.click(cartIcon!);

    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });
});
