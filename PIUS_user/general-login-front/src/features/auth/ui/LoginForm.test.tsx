import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { authApi } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

vi.mock("../api/authApi", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("рендерится форма", () => {
    render(<LoginForm onSwitch={() => {}} />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
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

  test("логин как USER", async () => {
    (authApi.login as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: false },
    });

    (jwtDecode as any).mockReturnValue({ is_admin: false });

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
      expect(window.location.href).toContain("5171");
    });
  });

  test("логин как SELLER", async () => {
    (authApi.login as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: true },
    });

    (jwtDecode as any).mockReturnValue({ is_admin: false });

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

  test("логин как ADMIN", async () => {
    (authApi.login as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: false },
    });

    (jwtDecode as any).mockReturnValue({ is_admin: true });

    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<LoginForm onSwitch={() => {}} />);

    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "Admin" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Admin123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.location.href).toContain("5175");
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

  test("fallback ошибка", async () => {
    window.alert = vi.fn();

    (authApi.login as any).mockRejectedValue({});

    render(<LoginForm onSwitch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login failed");
    });
  });
});