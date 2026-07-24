import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Nav from './Components/Nav.jsx'
import Folders from './Components/Folders.jsx'
import Layout from './layout.jsx'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import Home_layout from './home_layout.jsx'
import Todos from './Components/Todos.jsx'
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx'


const router = createBrowserRouter([
  {
    path: "/home",
    element: <Layout/>,
    children: [
      {
        path: "",
        element: <Home_layout/>,
        children: [
          {
            path: ":folder_name/:folder_id",
            element: <Todos/>
          }
        ]
      }
    ]
  },
  {
    path: "",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }
])

createRoot(document.getElementById('root')).render(
   <>
    <RouterProvider router={router}/>
   </>
)
