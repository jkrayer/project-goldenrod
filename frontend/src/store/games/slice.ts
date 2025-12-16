import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Game } from "@project_goldenrod/shared";
import type { RootState } from "../store";

// Game

export const games = createApi({
  reducerPath: "games",
  // trying: https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3000/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.data.token;

      headers.set("Authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAll: builder.query<Game[], void>({
      query: () => ({ url: `games`, method: "GET" }),
      transformResponse: (response: { data: Game[] }) => response.data,
    }),
    getOne: builder.query<Game, number>({
      query: (id: number) => ({ url: `games/${id}`, method: "GET" }),
    }),
    create: builder.mutation<Game, Omit<Game, "id">>({
      query: (body) => ({
        url: `games`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetAllQuery, useGetOneQuery, useCreateMutation } = games;
