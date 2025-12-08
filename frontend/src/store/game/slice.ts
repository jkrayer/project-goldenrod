import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Status = "idle" | "loading" | "succeeded" | "failed";

type GameSlice = {
  status: Status;
  data: { id: number; name: string; description: string };
};

const initialState: GameSlice = {
  status: "idle",
  data: { id: 0, name: "", description: "" },
};

export const gameSlice = createSlice<
  GameSlice,
  Record<string, never>,
  "game",
  never,
  "game"
>({
  name: "game",
  initialState,
  reducers: {},
});
