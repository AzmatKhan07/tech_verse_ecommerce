import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./lib/query/QueryProvider";
import { AuthProvider } from "react-auth-kit";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider
        authType="localstorage"
        authName="_auth"
        cookieDomain={window.location.hostname}
        cookieSecure={window.location.protocol === "https:"}
      >
        <App />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
);
