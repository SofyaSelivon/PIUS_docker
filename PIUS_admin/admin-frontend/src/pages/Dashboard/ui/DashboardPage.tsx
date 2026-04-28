import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { UsersList } from "../../../widgets/user-list/ui/UserList";
import { EditUserModal } from "../../../features/user-edit/ui/EditUserModal";

import { useState } from "react";
import type { User } from "../../../entities/user/model/types";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../../entities/user/api/userApi";
import { mapUserToUpdateDTO } from "../../../shared/helpers/mapUserToUpdateDTO";

const DashboardPage = () => {
  const { data: users = [] } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  const handleSave = async (updatedUser: User) => {
    await updateUser({
      userId: updatedUser.userId,
      data: mapUserToUpdateDTO(updatedUser),
    });

    setOpen(false);
    setSelectedUser(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <UsersList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditUserModal
        open={open}
        user={selectedUser}
        onClose={handleClose}
        onSave={handleSave}
      />
    </Container>
  );
};

export default DashboardPage;
