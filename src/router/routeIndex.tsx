import { createBrowserRouter } from "react-router";
import IndexPage from "../pages/IndexPage";
import MonthlyPage from "../pages/MonthlyPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <IndexPage />,
    },
    {
      path: "/monthly",
      element: <MonthlyPage />,
    },
  ],
  {
    basename: "/Weather-Broadcast/", // GitHub 自動部屬, 要對齊 repo 英文名稱
  }
);

export default router;
