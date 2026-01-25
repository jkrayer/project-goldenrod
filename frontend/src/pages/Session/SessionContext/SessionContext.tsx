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

type LocalSession = Session & {
  onlineMembers: Record<number, boolean>;
};

const newSession = (): LocalSession => ({
  session: { id: -1, name: "" },
  me: { role: "PLAYER" },
  members: [],
  onlineMembers: {},
});

const SessionContext = createContext<
  LocalSession & { setStatus: (userId: number, online: boolean) => void }
>({ ...newSession(), setStatus: () => {} });

export default function SessionContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { id = "-1" } = useParams<{ id: string }>();
  const [session, setSession] = useState<LocalSession>(newSession);

  useEffect(() => {
    getSession(id)
      .then((data) => {
        setSession({ ...data, onlineMembers: {} });
      })
      .catch((error) => {
        console.error("Failed to fetch session:", error);
      });
  }, [id]);

  const setStatus = (userId: number, online: boolean) => {
    setSession((prevSession) => ({
      ...prevSession,
      onlineMembers: {
        ...prevSession.onlineMembers,
        [userId]: online,
      },
    }));
  };

  return (
    <SessionContext.Provider value={{ ...session, setStatus }}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSessionContext = () => useContext(SessionContext);
