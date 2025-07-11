// main.jsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./common.css";

import Root from "./components/root/root.jsx";
import Home from "./components/home/home.jsx";
import State from "./components/state/state.jsx";
import Shelters from "./components/shelters/shelters.jsx";
import HeatWave from "./components/about/heat wave.jsx";
import Precautions from "./components/about/precautions.jsx";
import Symptoms from "./components/about/symptoms.jsx";
import News from "./components/news/News.jsx";
import RelatedSite from "./components/about/relatedsite.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "state", element: <State /> },
      { path: "shelters", element: <Shelters /> },
      {
        path: "about",
        children: [
          { path: "heat wave", element: <HeatWave /> },
          { path: "precautions", element: <Precautions /> },
          { path: "symptoms", element: <Symptoms />},
          { path: "relatedsite", element: <RelatedSite />}
        ],
      },
      { path: "news", element: <News /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
