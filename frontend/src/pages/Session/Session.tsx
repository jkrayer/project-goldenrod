import { Container } from "@mui/material";
import SnackbarProvider, { useSnackbar } from "./Toast/Toast";
import packageJson from "../../../package.json";
import SocketContextProvider, {
  useSocketContext,
} from "./SocketContext/Context";
import { useEffect } from "react";

export default function Session() {
  return (
    // Add full page frame here
    <SocketContextProvider>
      <SnackbarProvider>
        <Container disableGutters={true}>
          <Play />
          <h1>Session</h1>
          <p>Alpha version {packageJson.version}</p>
        </Container>
      </SnackbarProvider>
    </SocketContextProvider>
  );
}

// To be replaced by websocket messages
// probably move to a hook
const Play = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { connected } = useSocketContext();

  console.log(29, connected);

  useEffect(() => {
    if (connected) {
      enqueueSnackbar("Socket Connected");
    } else {
      enqueueSnackbar("Socket Disconnected");
    }
  }, [connected, enqueueSnackbar]);

  return <></>;
};
