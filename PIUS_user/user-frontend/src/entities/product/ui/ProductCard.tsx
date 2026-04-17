import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import type { Product } from "../model/types";
import { useAddToCartMutation } from "../../cart/api/cartApi";

interface Props {
  product: Product;
  onOpen: () => void;
}

export const ProductCard = ({ product, onOpen }: Props) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAdd = async () => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      }).unwrap();
    } catch (e) {
      console.error("Ошибка добавления в корзину", e);
    }
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardMedia
        component="img"
        height="180"
        image={product.img}
        onClick={onOpen}
        sx={{ cursor: "pointer" }}
      />

      <CardContent>
        <Typography variant="h6">{product.name}</Typography>

        <Typography color="primary" fontWeight={600}>
          {product.price}₽
        </Typography>

        <Button
          fullWidth
          disabled={isLoading || !product.available}
          sx={{
            mt: 2,
            background: "#6c5ce7",
            color: "#fff",
            "&:hover": { opacity: 0.9 },
          }}
          onClick={handleAdd}
        >
          Добавить в корзину
        </Button>
      </CardContent>
    </Card>
  );
};
