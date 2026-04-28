import { useState } from "react";

export const useCart = () => {
  const [items, setItems] = useState<number[]>([]);

  const addToCart = (id: number) => {
    setItems((prev) => [...prev, id]);
  };

  return {
    items,
    count: items.length,
    addToCart,
  };
};
