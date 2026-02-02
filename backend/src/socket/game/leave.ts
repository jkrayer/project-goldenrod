import type { Socket } from "socket.io";
import { ROOMS } from "./rooms.js";

export const leaveGame = (socket: Socket) => {
  return () => {
    const { userId, userName, room } = socket.data;

    // update room
    const roomData = ROOMS.get(room);
    const userData = roomData?.get(userId);
    userData!.online = false;

    console.log(`User ${userName} is leaving room ${room}`);

    socket.to(room).emit("game:leave:success", {
      message: `User ${userName} left the game.`,
      users: Object.fromEntries(room),
    });

    socket.leave(room);

    socket.data.room = null;
    socket.data.userName = null;
  };
};
