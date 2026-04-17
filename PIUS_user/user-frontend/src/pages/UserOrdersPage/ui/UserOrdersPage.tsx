import { useState } from "react";
import { Box } from "@mui/material";
import {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
} from "../../../entities/order/api/orderApi";
import type { OrderDetails } from "../../../entities/order/model/types";
import { OrderCard } from "../../../entities/order/ui/OrderCard";
import { OrderDetailsModal } from "../../../features/order/ui/OrderDetailsModal";

export const UserOrdersPage = () => {
  const { data } = useGetOrdersQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: selectedOrder } = useGetOrderDetailsQuery(selectedId!, {
    skip: !selectedId,
  });

  const orders = data?.orders ?? [];

  return (
    <>
      <Box sx={{ mt: 3, mb: 6, width: "90%", maxWidth: 1200, mx: "auto" }}>
        {orders.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            onClick={() => setSelectedId(order.orderId)}
          />
        ))}
      </Box>

      <OrderDetailsModal
        order={selectedOrder as OrderDetails}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
};
