import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useParams } from "react-router";
import type { Session, SessionMember } from "@project_goldenrod/shared";
import { getSession } from "../../../lib/api";

const newSession = (): Session => ({
  session: { id: -1, name: "" },
  me: { role: "PLAYER", userId: -1 },
  members: [],
});

const SessionContext = createContext<
  Session & {
    // setStatus: (userId: number, online: boolean) => void;
    mergeUsers: (members: Record<number, SessionMember>) => void;
  }
>({
  ...newSession(),
  mergeUsers: () => {},
});

export default function SessionContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { id = "-1" } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session>(newSession());

  useEffect(() => {
    getSession(id)
      .then((data) => setSession(data))
      .catch((error) => {
        console.error("Failed to fetch session:", error);
      });
  }, [id]);

  // const setStatus = (userId: number, online: boolean) => {
  //   setSession((prevSession) => ({
  //     ...prevSession,
  //     onlineMembers: {
  //       ...prevSession.onlineMembers,
  //       [userId]: online,
  //     },
  //   }));
  // };

  const mergeUsers = (newMembers: Record<number, SessionMember>) => {
    const copy = { ...newMembers };

    setSession((prevSession) => ({
      ...prevSession,
      members: [
        ...prevSession.members.map((member) => {
          delete copy[member.userId];

          return newMembers[member.userId]
            ? { ...newMembers[member.userId] }
            : member;
        }),
        ...Object.values(copy),
      ],
    }));
  };

  console.log("SESSION CONTEXT:", session);

  return (
    <SessionContext.Provider value={{ ...session, mergeUsers }}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSessionContext = () => useContext(SessionContext);
