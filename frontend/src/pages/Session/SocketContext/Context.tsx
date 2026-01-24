import { createContext, useContext, useEffect, useState } from "react";
import { SOCKET_EVENTS } from "@project_goldenrod/shared";
import { socket } from "./socket";
import { useAuthContext } from "../../../authentication/AuthContext";
import { useSessionContext } from "../SessionContext/SessionContext";
import { useSnackbar } from "../Toast/Toast";

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
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuthContext();
  const {
    session: { id, name },
  } = useSessionContext();
  // may or may not need user here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    console.log("40###", id, name);
    if (isAuthenticated && id !== -1) {
      socket.connect();

      socket
        .on("connect", () => {
          setConnected(true);
          console.log("Socket connected");
          const { userName } = JSON.parse(localStorage.getItem("user") || "{}");

          socket.emit(
            SOCKET_EVENTS.ROOM_JOIN,
            `${id}-${name}`,
            userName || "Anonymous",
          );
        })
        .on("disconnect", (reason, details) => {
          console.log("Socket disconnected", reason, details);
          setConnected(false);
          setUser("");
        })
        .on(SOCKET_EVENTS.ROOM_JOINED, (userName: string) => {
          console.log("Socket userJoined", userName);
          enqueueSnackbar(`${userName} joined the session`);
        });
    } else {
      socket.disconnect();
    }

    console.log("40%%%%", id, name);

    return () => socket.disconnect();
  }, [isAuthenticated, setConnected, setUser, id, name, enqueueSnackbar]);

  return <CONTEXT.Provider value={{ connected }}>{children}</CONTEXT.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => useContext(CONTEXT);
