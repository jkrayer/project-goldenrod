import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Game, GamePayload } from "@project_goldenrod/shared";
import type { RootState } from "../store";

// Game
export const games = createApi({
  reducerPath: "games",
  // trying: https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery
  // BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3000/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.data.token;

      headers.set("Authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  endpoints: (build) => ({
    getAllGames: build.query<Game[], void>({
      query: () => ({ url: `games`, method: "GET" }),
      transformResponse: (response: { data: Game[] }) => response.data,
    }),
    getOne: build.query<Game, number>({
      query: (id: number) => ({ url: `games/${id}`, method: "GET" }),
      transformResponse: (response: { data: Game }) => response.data,
    }),
    createGame: build.mutation<Game, GamePayload>({
      query: (body) => ({
        url: `games`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetAllGamesQuery, useGetOneQuery, useCreateGameMutation } =
  games;
