// main.jsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./common.css";

import Root from "./components/root/root.jsx";
import Home from "./components/home.jsx";
import Stats from "./components/stats/stats.jsx";
import Shelters from "./components/shelters.jsx";
import About from "./components/about.jsx";
import News from "./components/news/News.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "stats", element: <Stats /> },
      { path: "shelters", element: <Shelters /> },
      { path: "about", element: <About /> },
      { path: "news", element: <News /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
