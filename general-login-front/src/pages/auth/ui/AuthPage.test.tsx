import { render, screen, fireEvent, within } from "@testing-library/react";
import { AuthPage } from "./AuthPage";
import { describe, test, expect } from "vitest";

describe("AuthPage", () => {
  test("переключается между login и register", () => {
    render(<AuthPage />);

    // login по умолчанию
    expect(screen.getByText(/welcome back/i)).toBeTruthy();

    // находим блок с переключением (где ссылка Register)
    const switchBlock = screen.getByText(/don't have an account/i).closest("p")!;
    const registerLink = within(switchBlock).getByText(/register/i);

    fireEvent.click(registerLink);

    expect(screen.getByText(/step 1 of 3/i)).toBeTruthy();

    // обратно на login
    const switchBackBlock = screen.getByText(/already have an account/i).closest("p")!;
    const signInLink = within(switchBackBlock).getByText(/sign in/i);

    fireEvent.click(signInLink);

    expect(screen.getByText(/welcome back/i)).toBeTruthy();
  });
});