import type React from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import Hero from '@/components/ui/Hero/Hero'
import RecentPost from '@/components/ui/RecentPost/RecentPost'
import SeeAllPostsLink from '@/components/ui/SeeAllPostsLink/SeeAllPostsLink'

const HomePage = (): React.JSX.Element => {
  return (
    <section id="home-content">
      <Helmet>
        <title>RJ Leyva&#39;s Blog</title>
        <meta
          name="description"
          content="RJ Leyva's personal blog documenting web development insights through writing. Exploring React, TypeScript, web development patterns, and developer tools."
        />
        <meta
          name="keywords"
          content="web development, React, JavaScript, TypeScript, programming, blog, RJ Leyva"
        />
        <meta name="author" content="RJ Leyva" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Home | RJ Leyva's Blog" />
        <meta
          property="og:description"
          content="RJ Leyva's personal blog documenting web development insights through writing. Exploring React, TypeScript, web development patterns, and developer tools."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rjleyva-writes.pages.dev/" />
        <meta property="og:site_name" content="RJ Leyva's Blog" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://rjleyva-writes.pages.dev/" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: "RJ Leyva's Blog",
            description:
              "RJ Leyva's personal blog documenting web development insights through writing.",
            url: 'https://rjleyva-writes.pages.dev/',
            author: {
              '@type': 'Person',
              name: 'RJ Leyva'
            },
            publisher: {
              '@type': 'Person',
              name: 'RJ Leyva'
            }
          })}
        </script>
      </Helmet>
      <Hero heroTagline="Welcome to my blog! I'm RJ, and here I document my web development insights through writing." />
      <RecentPost />
      <SeeAllPostsLink />
    </section>
  )
}

export default HomePage
