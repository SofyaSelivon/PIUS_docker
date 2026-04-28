import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { describe, test, expect } from "vitest";

describe("Footer", () => {
  test("рендерит текст футера", () => {
    render(<Footer />);

    expect(
      screen.getByText(/© 2026 ChillNuts\. Никакие права не защищены\./i)
    ).toBeInTheDocument();
  });

  test("корректно монтируется", () => {
    const { container } = render(<Footer />);

    expect(container).toBeTruthy();
  });
});