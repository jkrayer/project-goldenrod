import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_ENDPOINTS,
  type User,
  type UserPayload,
} from "@project_goldenrod/shared";

export const login = createAsyncThunk<
  User,
  UserPayload,
  { rejectValue: string }
>("user/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `http://localhost:3000${API_ENDPOINTS.LOGIN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    let data;

    try {
      data = await response.json();
    } catch (error: unknown) {
      return rejectWithValue(
        `Failed to parse response: ${(error as Error)?.message || "Unknown Error"}`,
      );
    }

    if (!response.ok) {
      if (response.status === 400) {
        // could be validation errors
        return rejectWithValue("Invalid login credentials provided.");
      } else {
        return rejectWithValue(`Login is not OK: ${response.statusText}`);
      }
    } else {
      return data as User;
    }
  } catch (error: unknown) {
    throw new Error(
      `Login failed: ${(error as Error)?.message || "Unknown Error"}`,
    );
  }
});
