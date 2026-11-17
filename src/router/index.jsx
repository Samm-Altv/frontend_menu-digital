import { createBrowserRouter } from "react-router";
import Layout from "@/components/Layout.jsx";
import Home from "@/pages/Home.jsx";
import About from "@/pages/About.jsx";
import NotFound from "@/pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
export default router;
