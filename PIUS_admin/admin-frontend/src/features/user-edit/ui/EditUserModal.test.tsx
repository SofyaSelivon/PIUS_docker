import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { EditUserModal } from "./EditUserModal";

const user = {
  userId: "1",
  login: "john",
  firstName: "John",
  lastName: "Doe",
  isSeller: false,
  createdAt: "2024-01-01",
};

describe("EditUserModal", () => {
  test("не рендерится если нет user", () => {
    const { container } = render(
      <EditUserModal
        open={true}
        user={null}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("рендер формы", () => {
    render(
      <EditUserModal
        open={true}
        user={user as any}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue("john")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
  });

  test("save вызывает onSave", () => {
    const onSave = vi.fn();

    render(
      <EditUserModal
        open={true}
        user={user as any}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );

    fireEvent.click(screen.getByText("Save"));

    expect(onSave).toHaveBeenCalled();
  });
});