import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "./RegisterForm";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { authApi } from "../api/authApi";
import { tokenService } from "../../../shared/lib/token";

vi.mock("../api/authApi", () => ({
  authApi: {
    register: vi.fn(),
  },
}));

vi.mock("../../../shared/lib/token", () => ({
  tokenService: {
    set: vi.fn(),
  },
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("шаги переключаются", () => {
    render(<RegisterForm onSwitch={() => {}} />);

    expect(screen.getByText(/step 1 of 3/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByText(/step 1 of 3/i)).toBeTruthy();
  });

  test("валидация step 1", async () => {
    render(<RegisterForm onSwitch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText(/login is required/i)).toBeTruthy();
    expect(screen.getByText(/password is required/i)).toBeTruthy();
  });

  test("успешный проход всех шагов и регистрация", async () => {
    (authApi.register as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: false },
    });

    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<RegisterForm onSwitch={() => {}} />);

    // STEP 1
    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Maize111" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Maize111" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // STEP 2
    await screen.findByText(/step 2 of 3/i);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Ivan" },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Ivanov" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // STEP 3
    await screen.findByText(/step 3 of 3/i);

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "2000-01-01" },
    });

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Moscow" },
    });

    fireEvent.change(screen.getByLabelText(/telegram/i), {
      target: { value: "@testuser" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalled();
      expect(tokenService.set).toHaveBeenCalledWith("token123");
      expect(window.location.href).toContain("5171");
    });
  });

  test("регистрация продавца", async () => {
    (authApi.register as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: true },
    });

    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<RegisterForm onSwitch={() => {}} />);

    // STEP 1
    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "TestSeller" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Maize111" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Maize111" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // STEP 2
    await screen.findByText(/step 2 of 3/i);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Ivan" },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Ivanov" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // STEP 3
    await screen.findByText(/step 3 of 3/i);

    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "2000-01-01" },
    });

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Moscow" },
    });

    fireEvent.change(screen.getByLabelText(/telegram/i), {
      target: { value: "@seller" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(window.location.href).toContain("5172");
    });
  });
  test("все валидные данные (включая patronymic)", async () => {
    (authApi.register as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: false },
    });

    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<RegisterForm onSwitch={() => {}} />);

    // STEP 1 (валидные данные)
    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "Valid_User123" }, // валидный логин
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "StrongPass1" }, // валидный пароль
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "StrongPass1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // STEP 2 (включая patronymic)
    await screen.findByText(/step 2 of 3/i);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Ivan" },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Ivanov" },
    });

    fireEvent.change(screen.getByLabelText(/patronymic/i), {
      target: { value: "Ivanovich" }, // вот это поле раньше не тестилось
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // STEP 3 (валидные данные)
    await screen.findByText(/step 3 of 3/i);

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "1990-01-01" }, // точно >18 лет
    });

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Moscow" },
    });

    fireEvent.change(screen.getByLabelText(/telegram/i), {
      target: { value: "@valid_user123" }, // валидный telegram
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith(
        expect.objectContaining({
          login: "Valid_User123",
          password: "StrongPass1",
          firstName: "Ivan",
          lastName: "Ivanov",
          patronymic: "Ivanovich",
          city: "Moscow",
          telegram: "@valid_user123",
          isSeller: false,
        })
      );

      expect(tokenService.set).toHaveBeenCalledWith("token123");
      expect(window.location.href).toContain("5171");
    });
  });
});
