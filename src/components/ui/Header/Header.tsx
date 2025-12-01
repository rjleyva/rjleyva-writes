import type React from 'react'
import { Link } from 'react-router'
import Logo from '@/components/icons/Logo'
import Socials from '../Socials/Socials'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import styles from './header.module.css'

const Header = (): React.JSX.Element => {
  return (
    <header className={styles['header']}>
      <nav
        className={styles['header__nav']}
        id="main-navigation"
        aria-label="Main navigation"
      >
        <Link to="/">
          <Logo />
        </Link>

        <div className={styles['header__actions']}>
          <Socials />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

export default Header
