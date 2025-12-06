import type React from 'react'
import { Outlet } from 'react-router'
import Header from '@/components/ui/Header/Header'
import styles from './main-layout.module.css'

const MainLayout = (): React.JSX.Element => {
  return (
    <main id="main" className={styles['main-layout']}>
      <Header />
      <Outlet />
    </main>
  )
}

export default MainLayout
