import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS, type User } from "@project_goldenrod/shared";

export const login = createAsyncThunk<User, Pick<User, "username" | "email">>(
  "user/login",
  async (args) => {
    try {
      const response = await fetch(
        `http://localhost:3000${API_ENDPOINTS.login}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      console.error(
        `Login failed: ${(error as Error)?.message || "Unknown Error"}`,
      );
    }
  },
);
