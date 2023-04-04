import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { AudioContextProvider } from "./context/AudioContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <AudioContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </AudioContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
