import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Game } from "@project_goldenrod/shared";

// Game

export const games = createApi({
  reducerPath: "games",
  // trying: https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:3000/api/` }),
  endpoints: (builder) => ({
    getAll: builder.query<Game[], void>({
      query: () => ({ url: `games`, method: "GET" }),
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
