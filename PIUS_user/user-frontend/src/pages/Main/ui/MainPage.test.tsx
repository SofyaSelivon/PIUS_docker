import { render, screen, fireEvent } from "@testing-library/react";
import { MainPage } from "./MainPage";
import { describe, test, expect, vi, beforeEach } from "vitest";

const mockProductsQuery = vi.fn();

vi.mock("../../../entities/product/api/productApi", () => ({
  useGetProductsQuery: (...args: any[]) => mockProductsQuery(...args),
}));

vi.mock("../../../widgets/filters/ui/Filters", () => ({
  Filters: ({ onApply }: any) => (
    <button onClick={() => onApply({ category: "test" })}>
      ApplyFilters
    </button>
  ),
}));

vi.mock("../../../entities/product/ui/ProductList", () => ({
  ProductList: ({ onPageChange, onOpen }: any) => (
    <div>
      <button onClick={() => onPageChange(2)}>ChangePage</button>
      <button onClick={() => onOpen({ id: "1" })}>OpenProduct</button>
    </div>
  ),
}));

vi.mock("../../../features/product/ui/ProductModal", () => ({
  ProductModal: ({ open, onClose }: any) =>
    open ? (
      <div>
        Modal Open
        <button onClick={onClose}>Close</button>
      </div>
    ) : (
      <div>Modal Closed</div>
    ),
}));

describe("MainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockProductsQuery.mockReturnValue({
      data: { items: [], pagination: { totalPages: 3 } },
      isLoading: false,
    });
  });

  test("рендер базовых элементов", () => {
    render(<MainPage />);

    expect(screen.getByText("ApplyFilters")).toBeInTheDocument();
    expect(screen.getByText("ChangePage")).toBeInTheDocument();
  });

  test("применение фильтров сбрасывает page в 1", () => {
    render(<MainPage />);

    fireEvent.click(screen.getByText("ApplyFilters"));

    expect(mockProductsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        category: "test",
      })
    );
  });

  test("смена страницы", () => {
    render(<MainPage />);

    fireEvent.click(screen.getByText("ChangePage"));

    expect(mockProductsQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 2,
      })
    );
  });

  test("открытие модалки продукта", () => {
    render(<MainPage />);

    fireEvent.click(screen.getByText("OpenProduct"));

    expect(screen.getByText("Modal Open")).toBeInTheDocument();
  });

  test("закрытие модалки", () => {
    render(<MainPage />);

    fireEvent.click(screen.getByText("OpenProduct"));
    fireEvent.click(screen.getByText("Close"));

    expect(screen.getByText("Modal Closed")).toBeInTheDocument();
  });

  test("loading состояние прокидывается", () => {
    mockProductsQuery.mockReturnValue({
      data: { items: [], pagination: { totalPages: 1 } },
      isLoading: true,
    });

    render(<MainPage />);

    expect(screen.getByText("ChangePage")).toBeInTheDocument();
  });
});