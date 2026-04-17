import { Grid, Pagination, Box } from "@mui/material";
import { ProductCard } from "./ProductCard";
import type { Product } from "../model/types";

interface Props {
  products: Product[];
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpen: (p: Product) => void;
}

export const ProductList = ({
  products,
  loading,
  page,
  totalPages,
  onPageChange,
  onOpen,
}: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={3}
        mb={4}
        sx={{
          justifyContent: "center",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {products.map((p) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={p.id}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ProductCard
              product={p}
              onOpen={() => onOpen(p)}
              onAdd={() => {}}
            />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}
      >
        <Pagination
          page={page}
          count={totalPages}
          color="primary"
          onChange={(_, value) => onPageChange(value)}
        />
      </Box>
    </Box>
  );
};
