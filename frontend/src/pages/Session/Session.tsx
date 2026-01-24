import { Suspense } from "react";
import { Container } from "@mui/material";
import SnackbarProvider from "./Toast/Toast"; // , { useSnackbar }
import SessionContextProvider, {
  useSessionContext,
} from "./SessionContext/SessionContext";
import packageJson from "../../../package.json";
import SocketContextProvider from "./SocketContext/Context";

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
  const userSession = useSessionContext();
  return (
    <Container disableGutters={true}>
      <h1>{userSession.session.name}</h1>
      <p>Alpha version {packageJson.version}</p>
      <ul></ul>
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
