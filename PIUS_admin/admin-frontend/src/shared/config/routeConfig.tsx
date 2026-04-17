import { type RouteObject } from "react-router-dom";
import DashboardPage from "../../pages/Dashboard/ui/DashboardPage";

export const routeConfig: RouteObject[] = [
  {
    path: "/",
    element: <DashboardPage />,
  }
];
