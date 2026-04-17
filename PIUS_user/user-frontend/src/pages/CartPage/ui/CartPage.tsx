import { useState } from "react";
import { Box } from "@mui/material";
import { CartList } from "../../../widgets/cart/ui/CartList";
import { CreateOrderModal } from "../../../features/order/ui/CreateOrderModal";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "../../../entities/cart/api/cartApi";

export const CartPage = () => {
  const { data, isLoading } = useGetCartQuery();
  const [updateCart] = useUpdateCartItemMutation();
  const [removeCart] = useRemoveCartItemMutation();

  const [open, setOpen] = useState(false);

  const items = data?.items ?? [];

  const increase = async (id: string) => {
    const item = items.find((i) => i.productId === id);
    if (!item) return;

    await updateCart({
      productId: id,
      quantity: item.quantity + 1,
    }).unwrap();
  };

  const decrease = async (id: string) => {
    const item = items.find((i) => i.productId === id);
    if (!item || item.quantity <= 1) return;

    await updateCart({
      productId: id,
      quantity: item.quantity - 1,
    });
  };

  const remove = async (id: string) => {
    await removeCart(id).unwrap();;
  };

  const totalPrice = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 3 }}>
      <CartList
        items={items}
        totalPrice={totalPrice}
        loading={isLoading}
        onIncrease={increase}
        onDecrease={decrease}
        onDelete={remove}
        onCheckout={() => setOpen(true)}
      />

      <CreateOrderModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};
