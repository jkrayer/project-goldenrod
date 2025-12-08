import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Status = "idle" | "loading" | "succeeded" | "failed";

type LobbySlice = {
  status: Status;
  data: { id: number; name: string; description: string }[];
};

const initialState: LobbySlice = {
  status: "idle",
  data: [],
};

export const lobbySlice = createSlice<
  LobbySlice,
  Record<string, never>,
  "lobby",
  never,
  "lobby"
>({
  name: "lobby",
  initialState,
  reducers: {},
});
