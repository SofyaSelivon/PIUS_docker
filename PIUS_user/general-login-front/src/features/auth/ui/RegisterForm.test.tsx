import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "./RegisterForm";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { authApi } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

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

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
  });

  const fillSteps = async () => {
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

    await screen.findByText(/step 2/i);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Ivan" },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Ivanov" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await screen.findByText(/step 3/i);

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "2000-01-01" },
    });

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Moscow" },
    });

    fireEvent.change(screen.getByLabelText(/telegram/i), {
      target: { value: "@testuser" },
    });
  };

  test("регистрация USER", async () => {
    (authApi.register as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: false },
    });

    (jwtDecode as any).mockReturnValue({ is_admin: false });

    render(<RegisterForm onSwitch={() => {}} />);

    await fillSteps();

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(window.location.href).toContain("5171");
    });
  });

  test("регистрация SELLER", async () => {
    (authApi.register as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: true },
    });

    (jwtDecode as any).mockReturnValue({ is_admin: false });

    render(<RegisterForm onSwitch={() => {}} />);

    await fillSteps();

    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(window.location.href).toContain("5172");
    });
  });

  test("регистрация ADMIN", async () => {
    (authApi.register as any).mockResolvedValue({
      token: "token123",
      user: { isSeller: false },
    });

    (jwtDecode as any).mockReturnValue({ is_admin: true });

    render(<RegisterForm onSwitch={() => {}} />);

    await fillSteps();

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(window.location.href).toContain("5175");
    });
  });

  test("ошибка регистрации", async () => {
    window.alert = vi.fn();

    (authApi.register as any).mockRejectedValue({
      response: { data: { detail: "Error" } },
    });

    render(<RegisterForm onSwitch={() => {}} />);

    await fillSteps();

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error");
    });
  });

  test("ошибка: пароли не совпадают", async () => {
    render(<RegisterForm onSwitch={() => {}} />);

    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Maize111" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Wrong111" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test("ошибка: слабый пароль", async () => {
    render(<RegisterForm onSwitch={() => {}} />);

    fireEvent.change(screen.getByLabelText(/login/i), {
      target: { value: "TestUser" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "123" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText(/min 8 chars/i)).toBeInTheDocument();
  });

  test("ошибка: некорректное имя", async () => {
    render(<RegisterForm onSwitch={() => {}} />);

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
    await screen.findByText(/step 2/i);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Ivan123" },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Ivanov" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText(/only letters allowed/i)).toBeInTheDocument();
  });

  test("ошибка: возраст меньше 18", async () => {
    render(<RegisterForm onSwitch={() => {}} />);

    await fillSteps();

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "2015-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText(/you must be 18/i)).toBeInTheDocument();
  });

  test("ошибка: невалидный telegram", async () => {
    render(<RegisterForm onSwitch={() => {}} />);

    await fillSteps();

    fireEvent.change(screen.getByLabelText(/telegram/i), {
      target: { value: "@" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText(/invalid telegram/i)).toBeInTheDocument();
  });

  test("ошибка: пустой город", async () => {
    render(<RegisterForm onSwitch={() => {}} />);

    await fillSteps();

    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText(/city is required/i)).toBeInTheDocument();
  });

  test("ошибка: некорректное отчество", async () => {
    render(<RegisterForm onSwitch={() => {}} />);

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
    await screen.findByText(/step 2/i);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Ivan" },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Ivanov" },
    });

    fireEvent.change(screen.getByLabelText(/patronymic/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText(/only letters allowed/i)).toBeInTheDocument();
  });
});
