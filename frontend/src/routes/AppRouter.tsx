import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import * as Routes from "./routes";
import ProtectedRoute from "../authentication/ProtectedRoute";
import FourOFour from "../pages/Error/FourOFour";
import Home from "../pages/Home/Home";
import Session from "../pages/Session/Session";

const router = createBrowserRouter([
  {
    path: Routes.BASE_NAME,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: Routes.SESSION_PATH,
        element: (
          <ProtectedRoute>
            <Session />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <FourOFour />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
