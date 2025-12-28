import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { games } from "./slice";

describe("games API slice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [games.reducerPath]: games.reducer,
        user: () => ({ data: { token: "test-token" } }),
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(games.middleware),
    });
  });

  it("should have correct reducer path", () => {
    expect(games.reducerPath).toBe("games");
  });

  it("should inject authorization header with token", () => {
    const state: RootState = store.getState() as RootState;

    expect(state.user.data.token).toBe("test-token");
  });

  describe("endpoints", () => {
    it("should define getAllGames endpoint", () => {
      expect(games.endpoints.getAllGames).toBeDefined();
    });

    it("should define getOne endpoint", () => {
      expect(games.endpoints.getOne).toBeDefined();
    });

    it("should define createGame endpoint", () => {
      expect(games.endpoints.createGame).toBeDefined();
    });
  });

  describe("hooks", () => {
    it("should export useGetAllGamesQuery hook", () => {
      const { useGetAllGamesQuery } = games;
      expect(useGetAllGamesQuery).toBeDefined();
    });

    it("should export useGetOneQuery hook", () => {
      const { useGetOneQuery } = games;
      expect(useGetOneQuery).toBeDefined();
    });

    it("should export useCreateGameMutation hook", () => {
      const { useCreateGameMutation } = games;
      expect(useCreateGameMutation).toBeDefined();
    });
  });
});
