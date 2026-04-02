import type { SessionMember } from "@project_goldenrod/shared";

// me data stored in socket.data, but room data stored here

// Map of room IDs to sets of user IDs
export const ROOMS = new Map<string, Map<number, SessionMember>>();
