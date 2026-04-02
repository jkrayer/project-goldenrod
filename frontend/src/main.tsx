import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./authentication/AuthContext";
import AppRouter from "./routes/AppRouter";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import { appConfig } from "./lib/appConfig";

document.title = `${appConfig.appName} (${appConfig.appVariant})`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      {/* May want a loading spinner or some other UI while authenticating */}
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
