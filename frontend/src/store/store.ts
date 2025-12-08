import { configureStore } from "@reduxjs/toolkit";
import game from "./game";
import lobby from "./user";
import user from "./user";

export const store = configureStore({
  reducer: { game, lobby, user },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
