import type { Socket } from "socket.io";
import { ROOMS } from "./rooms.js";

export const leaveGame = (socket: Socket) => {
  return () => {
    const { userId, userName, room } = socket.data;

    // update room
    console.log(`User (${userId}) leaving room ${room}. Current ROOMS:`, ROOMS);

    // const roomData = ROOMS.get(room);
    // const userData = roomData?.get(userId);
    // userData!.online = false;

    console.log(`User ${userName} is leaving room ${room}`);
    console.log(ROOMS);

    // socket.to(room)
    socket.emit("game:leave:success", {
      message: `User ${userName} left the game.`,
      users: {},
    });

    socket.leave(room);

    socket.data.room = null;
    socket.data.userName = null;
  };
};
