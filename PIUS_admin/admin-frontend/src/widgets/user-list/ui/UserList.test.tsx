import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { UsersList } from "./UserList";

const users = [
  {
    userId: "1",
    login: "john",
    firstName: "John",
    lastName: "Doe",
    isSeller: true,
  },
];

describe("UsersList", () => {
  test("рендер списка пользователей", () => {
    render(
      <UsersList
        users={users as any}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("john")).toBeInTheDocument();
    expect(screen.getByText("Seller: Yes")).toBeInTheDocument();
  });

  test("клик edit вызывает callback", () => {
    const onEdit = vi.fn();

    render(
      <UsersList
        users={users as any}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("edit-button"));

    expect(onEdit).toHaveBeenCalled();
  });

  test("клик delete вызывает callback", () => {
    const onDelete = vi.fn();

    render(
      <UsersList
        users={users as any}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[1]);

    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
