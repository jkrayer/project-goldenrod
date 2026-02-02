import { Server } from "socket.io";
import { SOCKET_EVENTS } from "@project_goldenrod/shared";
import { authenticateTokenSocket } from "../lib/token.js";
import { joinGame } from "./game/join.js";
import { leaveGame } from "./game/leave.js";

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
 * @todo Implement logging and persistent storage for room/user states
 */
export default function initializeSocket(io: Server): void {
  // !!
  io.engine.on("connection_error", (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
  });

  // emit - to everyone
  // broadcast - to everyone except sender
  io.on("connection", async (socket) => {
    console.log("A is attempting to connec:", socket.id);

    socket.on("game:join", joinGame(socket));
    socket.on("game:leave", leaveGame(socket));

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
      socket.emit("authentication:failure", {
        message: "Authentication failed",
      });
      socket.disconnect();
      return;
    }

    socket.data.userId = userId;

    socket.emit("authentication:success", {
      message: "Authentication successful",
    });
  });
}
