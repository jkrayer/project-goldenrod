import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useParams } from "react-router";
import { type Session } from "@project_goldenrod/shared";
import { getSession } from "../../../lib/api";

const newSession = (): Session => ({
  session: { id: -1, name: "" },
  me: { role: "PLAYER" },
  members: [],
});

const SessionContext = createContext<Session>(newSession());

export default function SessionContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { id = "-1" } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session>(newSession);

  console.log("Session!!!!!", session);

  useEffect(() => {
    getSession(id)
      .then((data) => {
        setSession(data);
      })
      .catch((error) => {
        console.error("Failed to fetch session:", error);
      });
  }, [id]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSessionContext = () => useContext(SessionContext);
