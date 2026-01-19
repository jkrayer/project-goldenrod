import { Button, Container } from "@mui/material";
import SnackbarProvider, { useSnackbar } from "./Toast/Toast";
import packageJson from "../../../package.json";

export default function Session() {
  return (
    // Add full page frame here
    <SnackbarProvider>
      <Container disableGutters={true}>
        <Play />
        <h1>Session</h1>
        <p>Alpha version {packageJson.version}</p>
      </Container>
    </SnackbarProvider>
  );
}

// To be replaced by websocket messages
const Play = () => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Button onClick={() => enqueueSnackbar("This is a test message!")}>
      Show Toast
    </Button>
  );
};
