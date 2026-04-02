import type { Socket } from "socket.io";
import { ROOMS } from "./rooms.js";
import { prisma } from "../../lib/index.js";

export const joinGame = (socket: Socket) => {
  //
  return async ({
    gameName,
    gameId,
    userName,
  }: {
    gameName: string;
    gameId: number;
    userName: string;
  }) => {
    const { userId } = socket.data;

    console.log(
      `A user with the id ${userId} is attempting to join the room ${gameName}-${gameId}`,
    );

    const session = await prisma.sessions.findUnique({
      where: { id: gameId },
      select: { id: true, name: true },
    });

    if (!session) {
      console.log(`Room ${gameName}-${gameId} does not exist.`);

      // just to the current user
      socket.emit("game:join:failure", {
        messages: "Access Denied: This requested game does not exist.",
      });
      return; // or disconnect?
    }

    const meData = await prisma.sessionMembers.findUnique({
      where: {
        sessionId_userId: {
          sessionId: session.id,
          userId: userId,
        },
      },
    });

    if (!meData) {
      console.log(
        `The user with the id ${userId} is not a member of room ${gameName}-${gameId}.`,
      );

      // just to the current user
      socket.emit("game:join:failure", {
        messages: "Access Denied: The user is not a member of this game.",
      });
      return; // or disconnect?
    }

    const roomName = `${gameName}-${gameId}`;

    if (!ROOMS.has(roomName)) {
      ROOMS.set(roomName, new Map());
    }

    const room = ROOMS.get(roomName)!;

    if (!room.has(userId)) {
      room.set(userId, {
        userId,
        name: userName,
        role: meData.role,
        online: true,
      });
    } else {
      const existingUser = room.get(userId)!;
      existingUser.online = true;
    }

    socket.data.room = roomName;
    socket.data.userName = userName;

    console.log(
      `User ${socket.data.userId} successfully joined:`,
      socket.data.room,
    );
    console.log(ROOMS);

    // socket.join([socket.id, roomName]);
    // socket.to(roomName).emit("game:join:success", {
    socket.broadcast.emit("game:join:success", {
      message: `${userName} joined the game.`,
      users: Object.fromEntries(room),
    });
  };
};
