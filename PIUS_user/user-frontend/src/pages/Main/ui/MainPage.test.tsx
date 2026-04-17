import { render, screen } from "@testing-library/react";
import { MainPage } from "./MainPage";
import { describe, test, expect, vi } from "vitest";

vi.mock("../../../widgets/filters/ui/Filters", () => ({
  Filters: () => <div>Filters</div>,
}));

vi.mock("../../../entities/product/ui/ProductList", () => ({
  ProductList: () => <div>ProductList</div>,
}));

vi.mock("../../../features/product/ui/ProductModal", () => ({
  ProductModal: () => <div>Modal</div>,
}));

vi.mock("../../../entities/product/api/productApi", () => ({
  useGetProductsQuery: () => ({
    data: { items: [], pagination: { totalPages: 1 } },
    isLoading: false,
  }),
}));

describe("MainPage", () => {
  test("рендер страницы", () => {
    render(<MainPage />);

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("ProductList")).toBeInTheDocument();
    expect(screen.getByText("Modal")).toBeInTheDocument();
  });
});