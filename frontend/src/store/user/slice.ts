import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@project_goldenrod/shared";
import { login } from "./api";

type Status = "idle" | "loading" | "succeeded" | "failed";

type UserSlice = { status: Status; data: User };

const initialState: UserSlice = {
  status: "idle",
  data: {
    email: "",
    role: "PLAYER",
    token: "",
    userName: "",
  },
};

export const userSlice = createSlice<
  UserSlice,
  Record<string, never>,
  "user",
  never,
  "user"
>({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed";
      });
  },
});
