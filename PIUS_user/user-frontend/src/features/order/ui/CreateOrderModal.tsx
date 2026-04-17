import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useCreateOrderMutation } from "../../../entities/order/api/orderApi";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateOrderModal = ({ open, onClose }: Props) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const minLengths = { address: 5, city: 2, phone: 10 };

  const handleConfirm = async () => {
    setServerErrors([]);

    const errors: string[] = [];
    if (address.trim().length < minLengths.address)
      errors.push(`Адрес должен быть не менее ${minLengths.address} символов`);
    if (city.trim().length < minLengths.city)
      errors.push(`Город должен быть не менее ${minLengths.city} символов`);
    if (phone.trim().length < minLengths.phone)
      errors.push(`Телефон должен быть не менее ${minLengths.phone} символов`);

    if (errors.length > 0) {
      setServerErrors(errors);
      return;
    }

    try {
      await createOrder({
        deliveryAddress: address,
        deliveryCity: city,
        phone,
        deliveryComment: comment,
      }).unwrap();

      setAddress("");
      setCity("");
      setPhone("");
      setComment("");
      onClose();
    } catch (err: any) {
      if (err?.data?.detail) {
        const serverMsgs = err.data.detail.map((d: any) => d.msg);
        setServerErrors(serverMsgs);
      } else {
        setServerErrors(["Не удалось создать заказ. Попробуйте позже."]);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "white",
          p: 4,
          borderRadius: 3,
          mx: "auto",
          mt: "20vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6">Оформление заказа</Typography>

        {serverErrors.length > 0 &&
          serverErrors.map((err, idx) => (
            <Alert severity="error" key={idx}>
              {err}
            </Alert>
          ))}

        <TextField
          label="Город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <TextField
          label="Адрес"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <TextField
          label="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <TextField
          label="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleConfirm}
        >
          Подтвердить
        </Button>
      </Box>
    </Modal>
  );
};
