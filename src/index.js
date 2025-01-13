import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MovieContextProvider } from "./components/comman/Context";
import { FunctionsContextProvider } from "./components/comman/FunctionsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <>
    <MovieContextProvider>
      <FunctionsContextProvider>
        <App />
      </FunctionsContextProvider>
    </MovieContextProvider>

  </>
  // </React.StrictMode>
);

