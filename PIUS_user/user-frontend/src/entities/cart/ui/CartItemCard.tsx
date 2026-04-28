import { Card, CardContent, Typography, Box, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import DeleteIcon from "@mui/icons-material/Delete"
import type { CartItem } from "../model/types"

interface Props {
  item: CartItem
  onIncrease: () => void
  onDecrease: () => void
  onDelete: () => void
}

export const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
  onDelete,
}: Props) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box
          component="img"
          src={item.img}
          sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 2 }}
        />

        <Box flex={1}>
          <Typography fontWeight={600}>{item.name}</Typography>
          {/* <Typography color="text.secondary">
            {item.market.marketName}
          </Typography> */}
          <Typography mt={1}>{item.price} ₽</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={onDecrease} disabled={item.quantity === 1}>
            <RemoveIcon />
          </IconButton>

          <Typography>{item.quantity}</Typography>

          <IconButton onClick={onIncrease} disabled={item.quantity === item.available}>
            <AddIcon />
          </IconButton>
        </Box>

        <Typography width={100} textAlign="right">
          {Math.round(item.price * item.quantity * 100) / 100} ₽
        </Typography>

        <IconButton onClick={onDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  )
}
