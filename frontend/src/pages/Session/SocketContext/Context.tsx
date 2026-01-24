import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "./socket";
import { useAuthContext } from "../../../authentication/AuthContext";

// import { io } from "socket.io-client";

// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
// console.log("process.env.NODE_ENV", process.env.NODE_ENV, URL);

// const socket = io(URL, {
//   transports: ["websocket"],
// });

const CONTEXT = createContext<{ connected: boolean }>({ connected: false });

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthContext();
  // may or may not need user here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    socket
      .on("connect", () => {
        setConnected(true);
        console.log("Socket connected");
        const { userName } = JSON.parse(localStorage.getItem("user") || "{}");
        socket.emit("joinSession", 1, userName || "Anonymous");
      })
      .on("disconnect", () => {
        console.log("Socket disconnected");
        setConnected(false);
        setUser("");
      })
      .on("userJoined", (userName: string) => {
        console.log("Socket userJoined", userName);
      });
  }, [isAuthenticated, setConnected, setUser]);

  return <CONTEXT.Provider value={{ connected }}>{children}</CONTEXT.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => useContext(CONTEXT);
