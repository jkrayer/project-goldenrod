import express, { type Request, type Response } from "express";
import cors from "cors";
import {
  API_ENDPOINTS,
  gameValidation,
  userValidation,
  type Game,
  type UserPayload,
} from "@project_goldenrod/shared";
import { authenticateToken, errorHandler, validate } from "./lib/index.js";
import controllers from "./controllers/index.js";

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

// ROUTES ----------------------------------------------------------------------

// Home
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Auth
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

// Games
app.post(
  API_ENDPOINTS.GAMES,
  authenticateToken,
  // @ts-expect-error - to fix later
  validate<Game>(gameValidation),
  controllers.games.create,
);

app.get(API_ENDPOINTS.GAMES, authenticateToken, controllers.games.getAll);
app.get(API_ENDPOINTS.GAME, authenticateToken, controllers.games.get);

// ERROR HANDLER -------------------------------------------------------------
app.use(errorHandler);

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
