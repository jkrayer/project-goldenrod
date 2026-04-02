const REJECTED = "rejected";
const ROOM_JOIN = "join_room";
const ROOM_JOINED = "joined_room";
const ROOM_LEAVE = "leave_room";
const ROOM_LEFT = "left_room";

type KEYS =
  | "REJECTED"
  | "ROOM_JOIN"
  | "ROOM_JOINED"
  | "ROOM_LEAVE"
  | "ROOM_LEFT";

export const SOCKET_EVENTS: Record<KEYS, string> = Object.freeze({
  REJECTED,
  ROOM_JOIN,
  ROOM_JOINED,
  ROOM_LEAVE,
  ROOM_LEFT,
});
