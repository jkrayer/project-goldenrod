import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, type Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@project_goldenrod/shared";
// import { socket } from "./socket";
import { useAuthContext } from "../../../authentication/AuthContext";
import { useSessionContext } from "../SessionContext/SessionContext";
import { useSnackbar } from "../Toast/Toast";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

const CONTEXT = createContext<{ connected: boolean; leave: () => void }>({
  connected: false,
  leave: () => {},
});

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, token } = useAuthContext();
  const {
    session: { id, name },
    setStatus,
  } = useSessionContext();
  // may or may not need user here
   
  // const [user, setUser] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token || id === -1) return () => {};

    socketRef.current = io(URL, {
      // autoConnect: false,
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    socketRef.current.on(SOCKET_EVENTS.REJECTED, (message: string) => {
      console.log("REJECTED:", message);
      socketRef.current?.disconnect();
    });

    socketRef.current.on("authenticated", ({ userId }: { userId: string }) => {
      console.log("AUTHENTICATED:", userId);

      setConnected(true);

      const { userName } = JSON.parse(localStorage.getItem("user") || "{}");

      console.log("Emitting ROOM_JOIN", { id, name, userName });

      socketRef.current?.emit(
        SOCKET_EVENTS.ROOM_JOIN,
        `${id}-${name}`,
        userName || "Anonymous",
      );
    });

    socketRef.current.on(SOCKET_EVENTS.ROOM_JOINED, (user) => {
      console.log("ROOM_JOINED:", user);
      setStatus(user.userId, true);
      enqueueSnackbar(`${user.user} joined the session`);
    });

    socketRef.current.on(SOCKET_EVENTS.ROOM_LEFT, (user) => {
      console.log("ROOM_LEFT:", user);
      setStatus(user.userId, false);
      enqueueSnackbar(`${user.user} left the session`);
    });

    return () => {
      socketRef.current?.emit(SOCKET_EVENTS.ROOM_LEAVE, `${id}-${name}`);
      socketRef.current?.disconnect();
      setConnected(false);
    };
  }, [enqueueSnackbar, id, isAuthenticated, name, setStatus, token]);

  const leave = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.ROOM_LEAVE, `${id}-${name}`);
    socketRef.current?.disconnect();
    setConnected(false);
  }, [id, name, setConnected]);

  return (
    <CONTEXT.Provider value={{ connected, leave }}>{children}</CONTEXT.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => useContext(CONTEXT);
