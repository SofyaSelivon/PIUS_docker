import { useState } from "react";
import { Box, Container } from "@mui/material";

import { Filters } from "../../../widgets/filters/ui/Filters";
import { ProductList } from "../../../entities/product/ui/ProductList";
import { ProductModal } from "../../../features/product/ui/ProductModal";

import { useGetProductsQuery } from "../../../entities/product/api/productApi";
import type { Product, ProductFilters } from "../../../entities/product/model/types";

export const MainPage = () => {
  const [selected, setSelected] = useState<Product | null>(null);

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useGetProductsQuery(filters);

  const products = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <Container maxWidth="xl">
      <Filters
        onApply={(f) =>
          setFilters((prev) => ({
            ...prev,
            ...f,
            page: 1,
          }))
        }
      />

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ProductList
          products={products}
          loading={isLoading}
          page={filters.page}
          totalPages={totalPages}
          onPageChange={(p) =>
            setFilters((prev) => ({
              ...prev,
              page: p,
            }))
          }
          onOpen={setSelected}
        />
      </Box>

      <ProductModal
        product={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </Container>
  );
};