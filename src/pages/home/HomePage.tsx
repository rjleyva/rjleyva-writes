import type React from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import Hero from '@/components/ui/Hero/Hero'
import RecentPost from '@/components/ui/RecentPost/RecentPost'
import SeeAllPostsLink from '@/components/ui/SeeAllPostsLink/SeeAllPostsLink'
import { usePageTitle } from '@/hooks/usePageTitle'

const HomePage = (): React.JSX.Element => {
  const pageTitle = usePageTitle("RJ Leyva's Home Page")

  return (
    <section id="home-content">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Hero heroTagline="Welcome to my blog! I'm RJ, and here I document my web development insights through writing." />
      <RecentPost />
      <SeeAllPostsLink />
    </section>
  )
}

export default HomePage
