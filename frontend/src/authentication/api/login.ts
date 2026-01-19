import { type User, type UserPayload } from "@project_goldenrod/shared";
import { request } from "./request.ts";

export type LoginPayload = Omit<UserPayload, "userName">;

export const login = request<LoginPayload, User>("LOGIN");
