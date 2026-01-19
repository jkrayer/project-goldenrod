import { createContext, useContext, useState } from "react";
import { tail } from "ramda";
import { Button, Snackbar } from "@mui/material"; //  Alert

const SnackbarContext = createContext<{
  enqueueSnackbar: (message: string) => void;
  dequeueSnackbar: () => void;
  messages: string[];
}>({
  enqueueSnackbar: () => {},
  dequeueSnackbar: () => {},
  messages: [],
});

export default function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<string[]>([]);

  const enqueueSnackbar = (message: string) => {
    setMessages((old) => [...old, message]);
  };

  const dequeueSnackbar = () => {
    setMessages(tail);
  };

  return (
    <SnackbarContext.Provider
      value={{ enqueueSnackbar, dequeueSnackbar, messages }}
    >
      {children}
      <Toast />
    </SnackbarContext.Provider>
  );
}

function Toast() {
  const { messages, dequeueSnackbar } = useContext(SnackbarContext);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    console.log("handleClose", { reason });
    if (reason === "clickaway") {
      return;
    }
    dequeueSnackbar();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={messages.length > 0}
      autoHideDuration={6000}
      onClose={handleClose}
      message={messages[0]}
      action={
        <Button color="error" onClick={handleClose} size="small">
          Dismiss
        </Button>
      }
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = () => {
  const { enqueueSnackbar } = useContext(SnackbarContext);
  return { enqueueSnackbar };
};
