import type { ComponentType } from 'react'
import GithubIcon from '@/components/icons/GithubIcon'
import InstagramIcon from '@/components/icons/InstagramIcon'
import LinkedinIcon from '@/components/icons/LinkedinIcon'
import RssIcon from '@/components/icons/RssIcon'
import type { IconProps } from '@/types/icons'

export interface SocialLink {
  id: string
  name: string
  url: string
  label: string
  IconComponent: ComponentType<IconProps>
}

export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/rjleyva',
    label: "Visit RJ Leyva's GitHub Profile",
    IconComponent: GithubIcon
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/ryanjayleyva',
    label: "Visit RJ Leyva's LinkedIn Profile",
    IconComponent: LinkedinIcon
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/slammedwigo',
    label: "Visit RJ Leyva's Instagram Profile",
    IconComponent: InstagramIcon
  },
  {
    id: 'rss',
    name: 'RSS',
    url: '/rss-viewer.html',
    label: "Subscribe to RJ Leyva's RSS Feed",
    IconComponent: RssIcon
  }
]
