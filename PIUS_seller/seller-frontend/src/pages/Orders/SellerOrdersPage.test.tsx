import { render, screen, fireEvent } from "@testing-library/react";
import { SellerOrdersPage } from "./SellerOrdersPage";
import { describe, test, expect, vi } from "vitest";

const mockSetFiltersCall: any[] = [];

vi.mock("../../widgets/filters/ui/OrdersFilters", () => ({
  OrdersFilters: ({ filters, setFilters }: any) => (
    <div>
      <span>Filters page: {filters.page}</span>
      <button
        onClick={() =>
          setFilters({ page: 2, limit: 10, status: "done" })
        }
      >
        ChangeFilters
      </button>
    </div>
  ),
}));

vi.mock("../../widgets/ordersList/ui/OrdersList", () => ({
  OrdersList: ({ filters }: any) => (
    <div>OrdersList page: {filters.page}</div>
  ),
}));

describe("SellerOrdersPage", () => {
  test("рендерится с начальными фильтрами", () => {
    render(<SellerOrdersPage />);

    expect(screen.getByText(/Filters page: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/OrdersList page: 1/i)).toBeInTheDocument();
  });

  test("изменение фильтров обновляет OrdersList", () => {
    render(<SellerOrdersPage />);

    fireEvent.click(screen.getByText("ChangeFilters"));

    expect(screen.getByText(/OrdersList page: 2/i)).toBeInTheDocument();
  });

  test("filters прокидываются в оба компонента", () => {
    render(<SellerOrdersPage />);

    expect(screen.getByText(/Filters page: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/OrdersList page: 1/i)).toBeInTheDocument();
  });
});