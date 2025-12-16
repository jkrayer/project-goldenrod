import express, { type Request, type Response } from "express";
import cors from "cors";
import {
  gameValidation,
  userValidation,
  type Game,
  type UserPayload,
} from "@project_goldenrod/shared";
import { authenticateToken, validate } from "./lib/index.js";
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

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Define a sample API endpoint
app.post(
  "/api/users/register",
  validate<UserPayload>(userValidation),
  controllers.users.register,
);

app.post(
  "/api/users/login",
  validate<UserPayload>(userValidation),
  controllers.users.login,
);

app.post(
  "/api/games/",
  authenticateToken,
  // @ts-expect-error - to fix later
  validate<Game>(gameValidation),
  controllers.games.create,
);

app.get("/api/games/", authenticateToken, controllers.games.getAll);

app.get("/api/games/:id", authenticateToken, controllers.games.get);

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
