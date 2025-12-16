import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { games } from "./games/slice";
import user from "./user";

const userPersistConfig = {
  key: "goldenrod:user",
  storage,
};

const persistedReducer = persistReducer(userPersistConfig, user);

export const store = configureStore({
  reducer: { [games.reducerPath]: games.reducer, user: persistedReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      games.middleware,
      // rtkQueryErrorLogger
    ),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// import {
//   isRejectedWithValue,
//   type MiddlewareAPI,
//   type Middleware,
// } from "@reduxjs/toolkit";
// import { getErrorMessages } from "@itn/itn-portal-api-access";
// import { push } from "@store/notifications";

// /**
//  * Log a warning and show a toast!
//  */
// export const rtkQueryErrorLogger: Middleware =
//   ({ dispatch }: MiddlewareAPI) =>
//   (next) =>
//   (action) => {
//     if (isRejectedWithValue(action)) {
//       dispatch(
//         push([
//           "error",
//           getErrorMessages(action.error) ||
//             "An unknown error was returned from API.",
//         ]),
//       );
//     }

//     return next(action);
//   };
