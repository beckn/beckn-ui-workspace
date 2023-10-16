import React, { ReactNode } from 'react'
import Link from 'next/link'

interface LegacyLinkProps {
  children: ReactNode
  href: string
}

const LegacyLink: React.FC<LegacyLinkProps> = ({ children, href }) => {
  return (
    <Link legacyBehavior href={href}>
      {children}
    </Link>
  )
}

export default LegacyLink
