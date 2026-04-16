import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { authApi } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("рендерится форма", () => {
    render(<LoginForm onSwitch={() => {}} />);

    expect(screen.getByText(/sign in/i)).toBeTruthy();
    expect(screen.getByLabelText(/login/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  test("ввод данных работает", () => {
    render(<LoginForm onSwitch={() => {}} />);

    const loginInput = screen.getByLabelText(/login/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(loginInput, { target: { value: "TestUser" } });
    fireEvent.change(passwordInput, { target: { value: "Maize111" } });

    expect(loginInput.value).toBe("TestUser");
    expect(passwordInput.value).toBe("Maize111");
  });

  test("успешный логин (user)", async () => {
    (authApi.login as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: false },
    });

    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<LoginForm onSwitch={() => {}} />);

    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Maize111" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalled();
      expect(window.location.href).toContain("5171");
    });
  });

  test("успешный логин (seller)", async () => {
    (authApi.login as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: true },
    });

    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<LoginForm onSwitch={() => {}} />);

    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "TestSeller" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Maize111" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.location.href).toContain("5172");
    });
  });

  test("ошибка логина", async () => {
    window.alert = vi.fn();

    (authApi.login as any).mockRejectedValue({
      response: {
        data: { detail: "Invalid credentials" },
      },
    });

    render(<LoginForm onSwitch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("невалидный логин (пустые поля)", async () => {
    window.alert = vi.fn();

    // имитируем ошибку без response (как при пустых данных)
    (authApi.login as any).mockRejectedValue({});

    render(<LoginForm onSwitch={() => {}} />);

    // НЕ вводим данные
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Login failed");
    });
  });
});