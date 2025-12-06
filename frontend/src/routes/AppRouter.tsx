import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";
import * as Routes from "./routes";
import Admin from "../pages/Admin/Admin";
import Game from "../pages/Game/Game";
import Lobby from "../pages/Lobby/Lobby";
import Login from "../authentication/Login";
import Register from "../authentication/Register";
// import ErrorBoundary from "./ErrorBoundary";
// import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: Routes.BASE_NAME,
    children: [
      {
        index: true,
        Component: () => <h1>root</h1>,
      },
      {
        path: Routes.ADMIN_PATH,
        Component: Admin,
        //   errorElement: <ErrorBoundary />,
      },
      {
        path: Routes.GAME_PATH,
        children: [
          { index: true, loader: () => redirect("/lobby") },
          { path: ":gameId", Component: Game },
        ],
        // Component: Game,
        //   errorElement: <ErrorBoundary />,
      },
      {
        path: Routes.LOBBY_PATH,
        Component: Lobby,
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
