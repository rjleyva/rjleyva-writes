import type React from 'react'
import Hero from '@/components/ui/Hero/Hero'
import RecentPost from '@/components/ui/RecentPost/RecentPost'

const App = (): React.JSX.Element => {
  return (
    <section id="home-content">
      <Hero heroTagline="Welcome to my blog! I'm RJ, and here I document my web development insights through writing." />
      <RecentPost />
    </section>
  )
}

export default App
