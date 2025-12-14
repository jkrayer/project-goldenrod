import { configureStore } from "@reduxjs/toolkit";
import { games } from "./games/slice";
import user from "./user";

export const store = configureStore({
  reducer: { [games.reducerPath]: games.reducer, user },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
