import { createRoot } from "react-dom/client";
import { WalletProvider } from "./components/WalletProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <WalletProvider>
    <App />
  </WalletProvider>
);
