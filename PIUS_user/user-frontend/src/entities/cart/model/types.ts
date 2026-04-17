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

export interface CartMarket {
  marketId: string;
  marketName: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  available: number;
  quantity: number;
  img: string;
  market: CartMarket;
}

export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
}
