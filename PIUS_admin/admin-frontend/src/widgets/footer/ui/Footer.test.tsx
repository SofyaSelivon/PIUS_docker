import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />);

    expect(
      screen.getByText(/ChillNuts/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/2026/)
    ).toBeInTheDocument();
  });
});