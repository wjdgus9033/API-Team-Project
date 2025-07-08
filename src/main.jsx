// main.jsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./common.css";
import { ChakraProvider } from "@chakra-ui/react"
import { system } from "./ChakrConfig.js";

import Root from "./components/root/root.jsx";
import Home from "./components/home.jsx";
import State from "./components/state/state.jsx";
import Shelters from "./components/shelters.jsx";
import About from "./components/about/about.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "state", element: <State /> },
      { path: "shelters", element: <Shelters /> },
      { path: "about", element: <About /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
