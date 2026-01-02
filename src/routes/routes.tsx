import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router'
import RouteErrorBoundary from '@/components/RouteErrorBoundary/RouteErrorBoundary'
import Spinner from '@/components/ui/LoadingSpinner/LoadingSpinner'
import MainLayout from '../layouts/MainLayout'

const HomePage = lazy(() => import('@/pages/home/HomePage'))

const BlogPage = lazy(() => import('@/pages/blog/BlogPage'))
const BlogPosts = lazy(() => import('@/components/ui/BlogPosts/BlogPosts'))

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<Spinner />}>
            <HomePage />
          </Suspense>
        )
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
