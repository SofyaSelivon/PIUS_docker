import { Card, CardContent, Typography, Button, Box, Chip } from "@mui/material";
import type { OrderSummary, OrderStatus } from "../model/types";

interface Props {
  order: OrderSummary;
  onClick: () => void;
}

const statusColors: Record<OrderStatus, "default" | "primary" | "success" | "error"> = {
  generated: "default",
  in_progress: "primary",
  completed: "success",
  declined: "error",
};

export const OrderCard = ({ order, onClick }: Props) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <Typography variant="subtitle1">#{order.orderId.slice(0, 8)}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Box>
          <Chip
            label={order.status}
            color={statusColors[order.status]}
            sx={{ textTransform: "capitalize" }}
          />
        </Box>

        <Box>
          <Typography variant="body1">Сумма: {order.totalPrice.toFixed(2)} ₽</Typography>
          <Typography variant="body2">Товаров: {order.totalItems}</Typography>
        </Box>

        <Button variant="contained" onClick={onClick}>
          Подробнее
        </Button>
      </CardContent>
    </Card>
  );
};