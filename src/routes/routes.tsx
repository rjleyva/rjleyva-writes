import type { RouteObject } from 'react-router'
import Home from '@/pages/Home'
import MainLayout from '../layouts/MainLayout'

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  }
]

export default routes
