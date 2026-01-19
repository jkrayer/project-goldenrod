import { type PropsWithChildren } from "react";
import { useAuthContext } from "./AuthContext";
import Login from "./Login";

export default function ProtectedRoute({
  children,
}: PropsWithChildren<unknown>) {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <>{children}</> : <Login />;
}
