import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";
import ProtectedRoute from "./ProtectedRoute";
import * as Routes from "./routes";
import Admin from "../pages/Admin/Admin";
import Game from "../pages/Game/Game";
import Lobby from "../pages/Lobby/Lobby";
import Login from "../authentication/Login";
import Register from "../authentication/Register";
// import ErrorBoundary from "./ErrorBoundary";

const router = createBrowserRouter([
  {
    path: Routes.BASE_NAME,
    children: [
      {
        index: true,
        Component: () => <h1>root</h1>,
        middleware: [
          function () {
            // eslint-disable-next-line prefer-rest-params
            console.log("root middleware", arguments);
          },
        ],
      },
      {
        path: Routes.ADMIN_PATH,
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
        //   errorElement: <ErrorBoundary />,
      },
      {
        path: Routes.GAME_PATH,
        children: [
          { index: true, loader: () => redirect("/lobby") },
          {
            path: ":gameId",
            element: (
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            ),
          },
        ],
        // Component: Game,
        //   errorElement: <ErrorBoundary />,
      },
      {
        path: Routes.LOBBY_PATH,
        element: (
          <ProtectedRoute>
            <Lobby />
          </ProtectedRoute>
        ),
        //   errorElement: <ErrorBoundary />,
      },
      {
        path: Routes.LOGIN_PATH,
        Component: Login,
        //   errorElement: <ErrorBoundary />,
      },
      {
        path: Routes.REGISTER_PATH,
        Component: Register,
        //   errorElement: <ErrorBoundary />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
