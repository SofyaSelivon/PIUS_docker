import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductModal } from "./ProductModal";
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateMock = vi.fn();
const deleteMock = vi.fn();

vi.mock("../../../entities/product/api/productApi", () => ({
  useUpdateProductMutation: () => [updateMock],
  useDeleteProductMutation: () => [deleteMock],
}));

const product = {
  id: 1,
  name: "iPhone",
  price: 1000,
  available: 5,
  description: "phone",
  img: "test.jpg",
  category: "electronics",
};

describe("ProductModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders product info", () => {
    render(
      <ProductModal
        open
        onClose={vi.fn()}
        product={product}
      />
    );

    expect(screen.getByDisplayValue("iPhone")).toBeInTheDocument();
    expect(screen.getByText(/Категория:/)).toBeInTheDocument();
  });

  it("switches to edit mode", () => {
    render(
      <ProductModal
        open
        onClose={vi.fn()}
        product={product}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(
      screen.getByDisplayValue("iPhone")
    ).not.toBeDisabled();
  });

  it("updates product", async () => {
    render(
      <ProductModal
        open
        onClose={vi.fn()}
        product={product}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[0]);

    fireEvent.change(
      screen.getByDisplayValue("iPhone"),
      {
        target: { value: "iPhone Pro" },
      }
    );

    fireEvent.click(screen.getByTestId("SaveIcon").closest("button"));

    expect(updateMock).toHaveBeenCalled();
  });

  it("deletes product", async () => {
    window.confirm = vi.fn(() => true);

    deleteMock.mockResolvedValue({});

    const onClose = vi.fn();

    render(
      <ProductModal
        open
        onClose={onClose}
        product={product}
      />
    );

    const deleteButton =
      screen.getByTestId("DeleteIcon").parentElement!;

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(1);
      expect(onClose).toHaveBeenCalled();
    });
  });
  it("edits all fields", () => {
    render(
      <ProductModal
        open
        onClose={vi.fn()}
        product={product}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[0]); // edit

    fireEvent.change(screen.getByLabelText("Цена"), {
      target: { value: "2000" },
    });

    fireEvent.change(screen.getByLabelText("Количество"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByLabelText("Описание"), {
      target: { value: "new description" },
    });

    fireEvent.change(
      screen.getByLabelText("Картинка (URL)"),
      {
        target: { value: "new-image.jpg" },
      }
    );

    expect(screen.getByDisplayValue("2000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("new description")
    ).toBeInTheDocument();
  });
  it("sends updated data on save", async () => {
    updateMock.mockResolvedValue({});

    render(
      <ProductModal
        open
        onClose={vi.fn()}
        product={product}
      />
    );

    fireEvent.click(screen.getAllByRole("button")[0]);

    fireEvent.change(
      screen.getByDisplayValue("iPhone"),
      {
        target: { value: "iPhone Pro" },
      }
    );

    fireEvent.click(
      screen.getByTestId("SaveIcon").closest("button")!
    );

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith({
        id: 1,
        name: "iPhone Pro",
        price: 1000,
        available: 5,
        description: "phone",
        img: "test.jpg",
      });
    });
  });
  it("does not delete when confirm cancelled", () => {
    window.confirm = vi.fn(() => false);

    render(
      <ProductModal
        open
        onClose={vi.fn()}
        product={product}
      />
    );

    fireEvent.click(
      screen.getByTestId("DeleteIcon").closest("button")!
    );

    expect(deleteMock).not.toHaveBeenCalled();
  });

  it("renders image preview", () => {
    render(
      <ProductModal
        open
        onClose={vi.fn()}
        product={product}
      />
    );

    expect(
      screen.getByRole("img")
    ).toHaveAttribute("src", "test.jpg");
  });

  it("does not render image when img empty", () => {
    render(
      <ProductModal
        open
        onClose={vi.fn()}
        product={{ ...product, img: "" }}
      />
    );

    expect(
      screen.queryByRole("img")
    ).not.toBeInTheDocument();
  });

  
});