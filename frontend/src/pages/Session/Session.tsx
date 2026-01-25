import { Suspense } from "react";
import { Container } from "@mui/material";
import SnackbarProvider from "./Toast/Toast"; // , { useSnackbar }
import SessionContextProvider, {
  useSessionContext,
} from "./SessionContext/SessionContext";
import packageJson from "../../../package.json";
import SocketContextProvider, {
  useSocketContext,
} from "./SocketContext/Context";
import { useAuthContext } from "../../authentication/AuthContext";

export default function Session() {
  return (
    <SnackbarProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <SessionContextProvider>
          <SocketContextProvider>
            <Stage />
          </SocketContextProvider>
        </SessionContextProvider>
      </Suspense>
    </SnackbarProvider>
  );
}

const Stage = () => {
  const { members, onlineMembers, session } = useSessionContext();
  const { logout } = useAuthContext();
  const { leave } = useSocketContext();

  return (
    <Container disableGutters={true}>
      <h1>{session.name}</h1>
      <p>Alpha version {packageJson.version}</p>

      <button
        onClick={() => {
          leave();
          logout();
        }}
      >
        Logout
      </button>
      <ul>
        {members.map((member) => (
          <li key={member.userId}>
            {member.name} - {member.role} -&nbsp;
            {onlineMembers[member.userId] ? "Online" : "Offline"}
          </li>
        ))}
      </ul>
    </Container>
  );
};

// <Toasts>
// - get Session/Game by id, getSession Members by id, theoretically api checks
// - if user can have this and may reject them
//   <SessionProvider>
//     <SocketContextProvider>
//       <Session />
//     </SocketContextProvider>
//   </SessionProvider>
// </Toasts>
