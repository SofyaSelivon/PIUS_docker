import { Dialog, DialogContent, Typography, Button, Box } from "@mui/material";
import type { Product } from "../../../entities/product/model/types";
import { useAddToCartMutation } from "../../../entities/cart/api/cartApi";

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, open, onClose }: Props) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  if (!product) return null;

  const handleAdd = async () => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      }).unwrap();
    } catch (e) {
      console.error("Ошибка добавления", e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <img src={product.img} height={250} />

          <Typography variant="h5">{product.name}</Typography>
          <Typography>{product.description}</Typography>
          <Typography>Категория: {product.category}</Typography>
          <Typography>Остаток: {product.available}</Typography>

          <Button
            variant="contained"
            disabled={isLoading}
            onClick={handleAdd}
            sx={{
              background: "linear-gradient(135deg, #6c5ce7, #00b894)",
            }}
          >
            Добавить
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
