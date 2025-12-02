import type React from 'react'
import styles from './hero.module.css'

interface HeroProps {
  heroTagline: string
}

const Hero = ({ heroTagline }: HeroProps): React.JSX.Element => {
  return (
    <div className={styles['hero']} aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="title-large-gradient">
        {heroTagline}
      </h1>
    </div>
  )
}

export default Hero
