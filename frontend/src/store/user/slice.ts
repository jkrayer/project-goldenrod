import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Status = "idle" | "loading" | "succeeded" | "failed";

type UserSlice = { status: Status; userName: string };

const initialState: UserSlice = {
  status: "idle",
  userName: "",
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
});
