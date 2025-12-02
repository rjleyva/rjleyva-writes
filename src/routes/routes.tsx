import type { RouteObject } from 'react-router'
import BlogPosts from '@/components/ui/BlogPosts/BlogPosts'
import BlogPage from '@/pages/blog/BlogPage'
import HomePage from '@/pages/home/HomePage'
import MainLayout from '../layouts/MainLayout'

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/blog',
        element: <BlogPosts />
      },
      {
        path: '/blog/:topic/:slug',
        element: <BlogPage />
      }
    ]
  }
]

export default routes
