import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
} from "vitest";

import DashboardPage from "./DashboardPage";

const deleteMock = vi.fn();
const updateMock = vi.fn(() =>
  Promise.resolve({})
);

vi.mock("@mui/material/Container", () => ({
  default: ({ children }: any) => (
    <div>{children}</div>
  ),
}));

vi.mock("@mui/material/Typography", () => ({
  default: ({ children }: any) => (
    <div>{children}</div>
  ),
}));

vi.mock(
  "../../../widgets/user-list/ui/UserList",
  () => ({
    UsersList: ({
      users,
      onEdit,
      onDelete,
    }: any) => (
      <div>
        {users.map((u: any) => (
          <div key={u.userId}>
            <span>{u.login}</span>

            <button
              onClick={() => onEdit(u)}
            >
              edit
            </button>

            <button
              onClick={() =>
                onDelete(u.userId)
              }
            >
              delete
            </button>
          </div>
        ))}
      </div>
    ),
  })
);

vi.mock(
 "../../../features/user-edit/ui/EditUserModal",
 () => ({
   EditUserModal: ({
     open,
     user,
     onSave,
     onClose,
   }: any) =>
     open ? (
       <div>
         <div>EditModal</div>

         <button
           onClick={() => onSave(user)}
         >
           save-user
         </button>

         <button
           onClick={onClose}
         >
           close-modal
         </button>
       </div>
     ) : null,
 })
);

vi.mock(
 "../../../entities/user/api/userApi",
 () => ({
   useGetUsersQuery: () => ({
     data: [
       {
         userId: "1",
         login: "john",
         isSeller: false,
       },
     ],
   }),

   useDeleteUserMutation: () => [
     deleteMock,
   ],

   useUpdateUserMutation: () => [
     updateMock,
   ],
 })
);

vi.mock(
 "../../../shared/helpers/mapUserToUpdateDTO",
 () => ({
   mapUserToUpdateDTO: (u:any) => u,
 })
);

describe("DashboardPage", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("рендер пользователей", () => {
    render(<DashboardPage />);

    expect(
      screen.getByText("Users")
    ).toBeInTheDocument();

    expect(
      screen.getByText("john")
    ).toBeInTheDocument();
  });

  test("открытие модалки редактирования", () => {
    render(<DashboardPage />);

    fireEvent.click(
      screen.getByText("edit")
    );

    expect(
      screen.getByText("EditModal")
    ).toBeInTheDocument();
  });

  test("deletes user", () => {
    render(<DashboardPage />);

    fireEvent.click(
      screen.getByText("delete")
    );

    expect(deleteMock)
      .toHaveBeenCalledWith("1");
  });

  test(
    "updates user and closes modal on save",
    async () => {
      render(<DashboardPage />);

      fireEvent.click(
        screen.getByText("edit")
      );

      fireEvent.click(
        screen.getByText("save-user")
      );

      await waitFor(() => {
        expect(updateMock)
          .toHaveBeenCalledWith({
            userId: "1",
            data: expect.any(Object),
          });

        expect(
          screen.queryByText(
            "EditModal"
          )
        ).not.toBeInTheDocument();
      });
    }
  );

  test("closes modal", () => {
    render(<DashboardPage />);

    fireEvent.click(
      screen.getByText("edit")
    );

    fireEvent.click(
      screen.getByText(
        "close-modal"
      )
    );

    expect(
      screen.queryByText(
        "EditModal"
      )
    ).not.toBeInTheDocument();
  });
});
