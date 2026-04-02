import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { type SessionMember } from "@project_goldenrod/shared";
// import { socket } from "./socket";
import { useAuthContext } from "../../../authentication/AuthContext";
import { useSessionContext } from "../SessionContext/SessionContext";
import { useSnackbar } from "../Toast/Toast";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

const CONTEXT = createContext<{ connected: boolean }>({
  connected: false,
});

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, token, logout } = useAuthContext();
  const {
    session: { id, name },
    mergeUsers,
  } = useSessionContext();
  // may or may not need user here

  // const [user, setUser] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || id === -1) return () => {};

    socketRef.current = io(URL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    socketRef.current.on("authentication:failure", (message: string) => {
      console.log("REJECTED:", message);
      socketRef.current?.disconnect();
    });

    socketRef.current.on(
      "authentication:success",
      ({ message }: { message: string }) => {
        console.log("AUTHENTICATED:", message);

        setConnected(true);

        const { userName = "Anonymous" } = JSON.parse(
          localStorage.getItem("user") || "{}",
        );

        console.log("Emitting ROOM_JOIN", { id, name, userName });

        socketRef.current?.emit("game:join", {
          gameName: name,
          gameId: id,
          userName,
        });
      },
    );

    socketRef.current.on("game:join:failure", ({ message }) => {
      console.log("JOIN FAILURE:", message);
      enqueueSnackbar(`Join Failure: ${message}`);
      socketRef.current?.disconnect();
    });

    socketRef.current.on(
      "game:join:success",
      ({
        message,
        users,
      }: {
        message: string;
        users: Record<number, SessionMember>;
      }) => {
        console.log("ROOM_JOINED:", message);
        enqueueSnackbar(message);
        console.log("MERGING:", users);
        mergeUsers(users);
      },
    );

    socketRef.current.on(
      "game:leave:success",
      ({
        message,
        users,
      }: {
        message: string;
        users: Record<number, SessionMember>;
      }) => {
        console.log("ROOM_LEFT:", message);
        enqueueSnackbar(message);
        mergeUsers(users);
      },
    );

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setConnected(false);
      logout();
    });

    if (isAuthenticated) {
      socketRef.current.connect();
    } else {
      socketRef.current?.emit("game:leave");
      socketRef.current?.disconnect();
    }

    return () => {
      socketRef.current?.emit("game:leave");
      socketRef.current?.disconnect();
    };
  }, [enqueueSnackbar, id, isAuthenticated, logout, mergeUsers, name, token]);

  return <CONTEXT.Provider value={{ connected }}>{children}</CONTEXT.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => useContext(CONTEXT);
