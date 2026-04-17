import { Box, Typography, Button } from "@mui/material"
import { CartItemCard } from "../../../entities/cart/ui/CartItemCard"
import type { CartItem } from "../../../entities/cart/model/types"

interface Props {
  items: CartItem[]
  totalPrice: number
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onDelete: (id: string) => void
  onCheckout: () => void
}

export const CartList = ({
  items,
  totalPrice,
  onIncrease,
  onDecrease,
  onDelete,
  onCheckout,
}: Props) => {
  return (
    <Box>

      {items.map((item) => (
        <CartItemCard
          key={item.productId}
          item={item}
          onIncrease={() => onIncrease(item.productId)}
          onDecrease={() => onDecrease(item.productId)}
          onDelete={() => onDelete(item.productId)}
        />
      ))}

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontSize={22} fontWeight={600}>
          Итого: {totalPrice} ₽
        </Typography>

        <Button variant="contained" size="large" onClick={onCheckout}>
          Оформить заказ
        </Button>
      </Box>
    </Box>
  )
}