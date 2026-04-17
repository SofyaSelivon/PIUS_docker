import { render, screen, fireEvent } from "@testing-library/react";
import { Filters } from "./Filters";
import { describe, test, expect, vi } from "vitest";

describe("Filters", () => {
  test("изменение и применение фильтров", () => {
    const onApply = vi.fn();

    render(<Filters onApply={onApply} />);

    fireEvent.change(screen.getByLabelText(/поиск/i), {
      target: { value: "iphone" },
    });

    fireEvent.change(screen.getByLabelText(/мин цена/i), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByLabelText(/макс цена/i), {
      target: { value: "1000" },
    });

    fireEvent.click(screen.getByLabelText(/в наличии/i));

    fireEvent.click(screen.getByText(/применить/i));

    expect(onApply).toHaveBeenCalledWith({
      search: "iphone",
      category: undefined,
      minPrice: 100,
      maxPrice: 1000,
      available: true,
    });
  });
});