import { createBrowserRouter } from "react-router";
import IndexPage from "../pages/IndexPage";
import MonthlyPage from "../pages/MonthlyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/monthly",
    element: <MonthlyPage />,
  },
]);

export default router;
