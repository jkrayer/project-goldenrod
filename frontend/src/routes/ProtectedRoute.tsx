import { useEffect, type PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../store/store";
import { API_ENDPOINTS } from "@project_goldenrod/shared";

export default function ProtectedRoute({
  children,
}: PropsWithChildren<unknown>) {
  const navigate = useNavigate();
  // get local token
  const { token } = useSelector((state: RootState) => state.user.data);

  useEffect(() => {
    // if not exists redirect to login
    if (!token) {
      // add flash message: "You must be logged in to access that page"
      navigate("/login");
    }

    // token exists, ask the server if it's valid
    const validate = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000${API_ENDPOINTS.VERIFY_TOKEN}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!data.valid) {
          throw new Error("Invalid token");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // add flash message: "Session expired, please log in again"
        navigate("/login");
      }
    };

    validate();
  });

  return <>{children}</>;
}
