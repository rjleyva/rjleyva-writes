import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router'
import Spinner from '@/components/ui/LoadingSpinner/LoadingSpinner'
import HomePage from '@/pages/home/HomePage'
import MainLayout from '../layouts/MainLayout'

const BlogPage = lazy(() => import('@/pages/blog/BlogPage'))
const BlogPosts = lazy(() => import('@/components/ui/BlogPosts/BlogPosts'))

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
        element: (
          <Suspense fallback={<Spinner />}>
            <BlogPosts />
          </Suspense>
        )
      },
      {
        path: '/blog/:topic/:slug',
        element: (
          <Suspense fallback={<Spinner />}>
            <BlogPage />
          </Suspense>
        )
      }
    ]
  }
]

export default routes
