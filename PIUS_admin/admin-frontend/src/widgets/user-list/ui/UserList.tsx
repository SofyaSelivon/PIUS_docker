import type { User } from "../../../entities/user/model/types";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
};

export const UsersList = ({ users, onEdit, onDelete }: Props) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {users.map((user) => (
        <Card key={user.userId}>
          <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6">{user.login}</Typography>
              <Typography variant="body2">
                {user.firstName || "—"} {user.lastName || ""}
              </Typography>
              <Typography variant="caption">Seller: {user.isSeller ? "Yes" : "No"}</Typography>
            </Box>

            <Box>
              <IconButton data-testid="edit-button" onClick={() => onEdit(user)}>
                <EditIcon />
              </IconButton>

              <IconButton data-testid="delete-button" onClick={() => onDelete(user.userId)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};