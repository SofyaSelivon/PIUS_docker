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

  test("updates text fields", () => {
    render(
      <EditUserModal
        open={true}
        user={user as any}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );

    fireEvent.change(
      screen.getByLabelText("Login"),
      {
        target: { value: "newlogin" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("First Name"),
      {
        target: { value: "Mike" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Last Name"),
      {
        target: { value: "Smith" },
      }
    );

    expect(
      screen.getByDisplayValue("newlogin")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Mike")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Smith")
    ).toBeInTheDocument();
  });

  test("toggles seller checkbox", () => {
    render(
      <EditUserModal
        open={true}
        user={user as any}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );

    const checkbox = screen.getByRole(
      "checkbox"
    );

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test("save sends updated form", () => {
    const onSave = vi.fn();

    render(
      <EditUserModal
        open
        user={user as any}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );

    fireEvent.change(
      screen.getByLabelText("Login"),
      {
        target: {
          value: "updated-user",
        },
      }
    );

    fireEvent.click(
      screen.getByText("Save")
    );

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        login: "updated-user",
      })
    );
  });

  test("calls onClose when escape pressed", () => {
    const onClose = vi.fn();

    render(
      <EditUserModal
        open
        user={user as any}
        onClose={onClose}
        onSave={vi.fn()}
      />
    );

    fireEvent.keyDown(
      document,
      { key: "Escape" }
    );
  });

  test("renders empty fallback for missing names", () => {
    render(
      <EditUserModal
        open
        user={{
          ...user,
          firstName: "",
          lastName: undefined,
        } as any}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText("First Name")
    ).toHaveValue("");

    expect(
      screen.getByLabelText("Last Name")
    ).toHaveValue("");
  });

  test("updates form when user prop changes", () => {
    const { rerender } = render(
      <EditUserModal
        open
        user={user as any}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );

    rerender(
      <EditUserModal
        open
        user={{
          ...user,
          login: "changed",
        } as any}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(
      screen.getByDisplayValue("changed")
    ).toBeInTheDocument();
  });
});
