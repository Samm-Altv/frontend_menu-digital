import { createBrowserRouter } from "react-router";
import Layout from "@/components/layout/Layout.jsx";
import Home from "@/pages/Home.jsx";
import About from "@/pages/About.jsx";
import Cart from "@/pages/Cart.jsx";
import Login from "@/pages/Login.jsx";
import Admin from "@/pages/Admin.jsx";
import ProtectedRoute from "@/components/auth/ProtectedRoute.jsx";
import NotFound from "@/pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <Login /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
