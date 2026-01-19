import express from "express";
import cors from "cors";
import {
  API_ENDPOINTS,
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

// ROUTES ----------------------------------------------------------------------

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
app.listen(port, () => {
  console.log(`Running application in environment: ${process.env.NODE_ENV}`);
  console.log(`The server is running on port: ${port}`);
});
