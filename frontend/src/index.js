import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import {DataProvider} from "./Context/ChatProvider"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  <DataProvider>
    <ChakraProvider>
      
        <App />
      
    </ChakraProvider>
  </DataProvider>
  </BrowserRouter>
);
