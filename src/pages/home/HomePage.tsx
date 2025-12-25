import type React from 'react'
import Hero from '@/components/ui/Hero/Hero'
import RecentPost from '@/components/ui/RecentPost/RecentPost'
import SeeAllPostsLink from '@/components/ui/SeeAllPostsLink/SeeAllPostsLink'
import { usePageTitle } from '@/hooks/usePageTitle'

const HomePage = (): React.JSX.Element => {
  usePageTitle("RJ Leyva's Home Page")

  return (
    <section id="home-content">
      <Hero heroTagline="Welcome to my blog! I'm RJ, and here I document my web development insights through writing." />
      <RecentPost />
      <SeeAllPostsLink />
    </section>
  )
}

export default HomePage
