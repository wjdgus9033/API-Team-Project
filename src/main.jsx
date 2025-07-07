// main.jsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root.jsx";
import Home from "./routes/home.jsx";
import Stats from "./routes/stats/stats.jsx";
import Shelters from "./routes/shelters.jsx";
import About from "./routes/about.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "stats", element: <Stats /> },
      { path: "shelters", element: <Shelters /> },
      { path: "about", element: <About /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
