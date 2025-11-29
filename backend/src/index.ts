import express, { type Request, type Response } from "express";
import controllers from "./controllers/index.js";

// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Define a sample API endpoint
app.post("/api/users/register", controllers.users.register);

app.post("/api/users/login", controllers.users.login);

app.post("/api/games/", controllers.games.create);

app.get("/api/games/", controllers.games.getAll);

app.get("/api/games/:id", controllers.games.get);

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});
