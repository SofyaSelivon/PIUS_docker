import { type RouteObject } from "react-router-dom";
import { MainPage } from "../../pages/Main/ui/MainPage";
import { UserOrdersPage } from "../../pages/UserOrdersPage/ui/UserOrdersPage";
import { CartPage } from "../../pages/CartPage/ui/CartPage";

export const routeConfig: RouteObject[] = [
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/orders",
    element: <UserOrdersPage />
  },
  {
    path: "/cart",
    element: <CartPage />
  }
];