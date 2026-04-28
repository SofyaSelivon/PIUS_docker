import { useEffect, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import type { User } from "../../../entities/user/model/types";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
};

export const EditUserModal = ({ open, user, onClose, onSave }: Props) => {
  const [form, setForm] = useState<User | null>(null);

  useEffect(() => {
    setForm(user);
  }, [user]);

  if (!form) return null;

  const handleChange = (field: keyof User, value: any) => {
    setForm((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const handleSubmit = () => {
    if (form) {
      onSave(form);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle style={{ color: '#000000' }}>Edit User</DialogTitle>

      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 8,
        }}
      >
        <TextField
          label="User ID"
          value={form.userId}
          disabled
        />

        <TextField
          label="Login"
          value={form.login}
          onChange={(e) => handleChange("login", e.target.value)}
        />

        <TextField
          label="First Name"
          value={form.firstName || ""}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />

        <TextField
          label="Last Name"
          value={form.lastName || ""}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />

        <TextField
          label="Created At"
          value={form.createdAt}
          disabled
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.isSeller}
              onChange={(e) =>
                handleChange("isSeller", e.target.checked)
              }
            />
          }
          label="Seller"
        />

        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};
