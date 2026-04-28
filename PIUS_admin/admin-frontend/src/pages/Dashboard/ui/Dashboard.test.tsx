import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import DashboardPage from "./DashboardPage";

vi.mock("@mui/material/Container", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@mui/material/Typography", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../../widgets/user-list/ui/UserList", () => ({
  UsersList: ({ users, onEdit, onDelete }: any) => (
    <div>
      {users.map((u: any) => (
        <div key={u.userId}>
          <span>{u.login}</span>

          <button onClick={() => onEdit(u)}>edit</button>
          <button onClick={() => onDelete(u.userId)}>delete</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../../features/user-edit/ui/EditUserModal", () => ({
  EditUserModal: ({ open }: any) =>
    open ? <div>EditModal</div> : null,
}));

vi.mock("../../../entities/user/api/userApi", () => ({
  useGetUsersQuery: () => ({
    data: [
      { userId: "1", login: "john", isSeller: false },
    ],
  }),
  useDeleteUserMutation: () => [vi.fn()],
  useUpdateUserMutation: () => [vi.fn()],
}));

vi.mock("../../../shared/helpers/mapUserToUpdateDTO", () => ({
  mapUserToUpdateDTO: (u: any) => u,
}));

describe("DashboardPage", () => {
  test("рендер пользователей", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("john")).toBeInTheDocument();
  });

  test("открытие модалки редактирования", () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText("edit"));

    expect(screen.getByText("EditModal")).toBeInTheDocument();
  });
});
