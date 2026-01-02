import type React from 'react'
import { Link } from 'react-router'
import ArrowIcon from '@/components/icons/ArrowIcon'
import { useRoutePreloader } from '@/hooks/useRoutePreloader'
import styles from './see-all-posts-link.module.css'

const SeeAllPostsLink = (): React.JSX.Element => {
  const { preloadRoute } = useRoutePreloader()

  const handlePreload = (): void => {
    preloadRoute('blog-listing')
  }

  return (
    <div className={styles['wrapper']}>
      <Link
        className={styles['link']}
        to="/blog"
        aria-label="See all blog posts"
        onMouseEnter={handlePreload}
        onFocus={handlePreload}
      >
        <span className={styles['content']}>
          <span className={styles['label']}>See all posts</span>
          <span className={styles['detail']}>Explore the full archive</span>
        </span>
        <span className={styles['arrow']} aria-hidden>
          <ArrowIcon size={24} ariaLabel="Navigate to blog posts" />
        </span>
      </Link>
    </div>
  )
}

export default SeeAllPostsLink
