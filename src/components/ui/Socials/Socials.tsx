import type React from 'react'
import { socialLinks } from '@/constants/socialLinks'
import styles from './socials.module.css'

const Socials = (): React.JSX.Element => {
  return (
    <nav aria-label="Social media links">
      <ul className={`${styles['socials__list']} flex-row flex-center`}>
        {socialLinks.map(({ id, url, label, IconComponent }) => (
          <li key={id} className="flex-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="interactive-element"
            >
              <IconComponent className={styles['socials__icon']} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Socials
