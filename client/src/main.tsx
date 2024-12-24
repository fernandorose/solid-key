import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Supports weights 100-900
import "@fontsource-variable/inter";

import "./styles/globals.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
