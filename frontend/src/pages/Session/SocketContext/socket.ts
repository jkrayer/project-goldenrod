import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
console.log("process.env.NODE_ENV", process.env.NODE_ENV, URL);

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});

console.log("Socket ID:INITIAL", socket.id);
