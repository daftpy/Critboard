import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import IndexView from "./components/view/IndexView.tsx";
import "./styles/App.css";
import SubmitView from "./components/view/SubmitView.tsx";
import SubmissionView from "./components/view/SubmissionView.tsx";
import {UserProvider} from "./contexts/UserContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexView />,
  },
  {
    path: "/submit",
    element: <SubmitView />,
  },
  {
    path: "/submission/:commentId",
    element: <SubmissionView />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>

  </React.StrictMode>,
);
