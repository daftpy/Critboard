import React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import IndexView from './components/view/IndexView.tsx'
import "./styles/App.css"
import SubmitView from './components/view/SubmitView.tsx'
import SubmissionView from './components/view/SubmissionView.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexView />
  },
  {
    path: "/submit",
    element: <SubmitView />,
  },
  {
    path: "/submission/:commentId",
    element: <SubmissionView />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
)
