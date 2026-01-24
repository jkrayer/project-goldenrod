import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import {
  API_ENDPOINTS,
  SOCKET_EVENTS,
  userValidation,
  sessionValidation,
  type SessionPayload,
  type UserPayload,
} from "@project_goldenrod/shared";
import controllers from "./controllers/index.js";
import { authenticateToken, errorHandler, validate } from "./lib/index.js";
import morganMiddleware from "./lib/middleware/morgan.js";

// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: /https?:\/\/localhost:5173/, // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(morganMiddleware);

// SOCKET ----------------------------------------------------------------------
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on(SOCKET_EVENTS.ROOM_JOIN, (sessionId: string, user: string) => {
    console.log(`${user} joined session ${sessionId}`);

    socket.join(String(sessionId));
    socket.data.user = user;

    socket.broadcast
      .to(String(sessionId))
      .emit(SOCKET_EVENTS.ROOM_JOINED, user);
  });

  socket.on(SOCKET_EVENTS.ROOM_LEAVE, (sessionId: string) => {
    console.log(`${socket.data.user} left session ${sessionId}`);

    socket.leave(String(sessionId));
    socket.broadcast
      .to(String(sessionId))
      .emit(SOCKET_EVENTS.ROOM_LEFT, socket.data.user);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});
// REST ROUTES -----------------------------------------------------------------

// AUTH  --------------------
app.post(
  API_ENDPOINTS.REGISTER,
  validate<UserPayload>(userValidation),
  controllers.users.register,
);

app.post(
  API_ENDPOINTS.LOGIN,
  validate<UserPayload>(userValidation),
  controllers.users.login,
);

app.get(
  API_ENDPOINTS.VERIFY_TOKEN,
  authenticateToken,
  controllers.users.verify,
);

// SESSIONS --------------------
app.post(
  API_ENDPOINTS.SESSIONS,
  authenticateToken,
  validate<SessionPayload>(sessionValidation),
  controllers.sessions.create,
);

app.get(API_ENDPOINTS.SESSION, authenticateToken, controllers.sessions.getById);

app.post(
  API_ENDPOINTS.SESSION_JOIN,
  authenticateToken,
  controllers.sessions.join,
);

// REST  --------------------
app.all("{*splat}", controllers.all);

// ERROR HANDLER -------------------------------------------------------------
app.use(errorHandler);

// Start the Express server
server.listen(port, () => {
  console.log(`Running application in environment: ${process.env.NODE_ENV}`);
  console.log(`The server is running on port: ${port}`);
});
