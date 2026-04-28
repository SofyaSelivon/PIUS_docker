import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("renders logo and admin text", () => {
    render(<Header />);

    expect(
      screen.getByAltText("Marketplace")
    ).toBeInTheDocument();

    expect(
      screen.getByText("ADMIN")
    ).toBeInTheDocument();
  });
});