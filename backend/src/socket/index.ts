import { Server } from "socket.io";
import { SOCKET_EVENTS } from "@project_goldenrod/shared";
import { authenticateTokenSocket } from "../lib/token.js";

const ROOMS = new Map<
  string,
  Map<number, { id: number; name: string; online: boolean }>
>(); // Map of room IDs to sets of user IDs

/**
 * Initializes Socket.IO event handlers for connection management and room operations.
 *
 * Sets up engine-level connection error handling and socket-level event listeners
 * for user authentication, room joining/leaving, and disconnection.
 *
 * @param io - A Socket.IO Server instance used to handle real-time bidirectional communication
 * @returns void
 *
 * @remarks
 * - Authenticates users based on token validation during connection
 * - Manages room membership with join/leave events
 * - Broadcasts user presence updates to other room participants
 * - Handles connection errors and invalid authentication attempts
 */
export default function initializeSocket(io: Server): void {
  // !!
  io.engine.on("connection_error", (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
  });

  io.on("connection", async (socket) => {
    console.log("a user connected:", socket.id);

    // // To do, check user access to room
    socket.on(SOCKET_EVENTS.ROOM_JOIN, (sessionId: string, user: string) => {
      console.log(
        `A user named ${user}, with id: ${socket.data.userId} joined session ${sessionId}`,
      );

      // check if room exits; if not create it
      if (!ROOMS.has(String(sessionId))) {
        ROOMS.set(String(sessionId), new Map());
      }

      const room = ROOMS.get(String(sessionId))!;

      // Add or update the user
      if (!room.has(socket.data.userId)) {
        room.set(socket.data.userId, {
          id: socket.data.userId,
          name: user,
          online: true,
        });
      } else {
        const existingUser = room.get(socket.data.userId)!;
        existingUser.online = true;
        room.set(socket.data.userId, existingUser);
      }

      socket.join(String(sessionId));
      socket.data.user = user;
      socket.data.online = true;

      //   console.log("DATA", socket.data);
      //   console.log("ROOM", JSON.stringify(Array.from(room.values())));

      console.log(`Broadcasting ${user} joined session ${sessionId}`);
      socket.broadcast
        .to(String(sessionId))
        .emit(SOCKET_EVENTS.ROOM_JOINED, socket.data);
    });

    // !! Set user to offline
    socket.on(SOCKET_EVENTS.ROOM_LEAVE, (sessionId: string) => {
      console.log(`${socket.data.user} left session ${sessionId}`);

      // to do, mark user as offline in ROOMS map and emit update to room members
      socket.broadcast
        .to(String(sessionId))
        // !! Emit user left event to other users in the room
        .emit(SOCKET_EVENTS.ROOM_LEFT, socket.data);

      socket.leave(String(sessionId));
    });

    socket.on("disconnect", (sessionId) => {
      // to do, mark user as offline in ROOMS map and emit update to room members
      console.log("user disconnected:", socket.data);

      socket.broadcast
        .to(String(sessionId))
        // !! Emit user left event to other users in the room
        .emit(SOCKET_EVENTS.ROOM_LEFT, { ...socket.data, online: false });
    });

    // Authenticate user based on token
    const userId = await authenticateTokenSocket(socket.handshake.auth.token);

    if (userId === -1) {
      console.log("Authentication failed for socket:", socket.id);
      socket.emit(SOCKET_EVENTS.REJECTED, "Authentication failed");
      socket.disconnect();
      return;
    }

    socket.data.userId = userId;

    socket.emit("authenticated", { userId });
  });
}
