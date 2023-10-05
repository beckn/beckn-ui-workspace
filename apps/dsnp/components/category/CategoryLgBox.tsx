// import Image from 'next/image'
import { Image } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface Props {
  name: string
  title: string
  description: string
  styles: {
    backgroundColor: string
    flexDirection: string
    paddingInline: string
    paddingBlock: string
    textAlign?: string
    gridRow: string
    gridColumn: string
  }
  href: string
  imgSrc: string
  imgWidth: number
  imgHeight: number
}
const CategoryLgBox: React.FC<Props> = ({ name, title, description, styles, href, imgSrc, imgWidth, imgHeight }) => {
  const { t } = useLanguage()

  return (
    <div
      key={title}
      className={`flex justify-around items-center rounded-md shadow-lg overflow-hidden`}
      style={styles as React.CSSProperties}
    >
      <div className="mx-[0.5rem]">
        <h3 className="text-xl 2xl:text-2xl font-[500]">{t(`${title}`)}</h3>
        <p className="mt-2 text-sm">{t(`${description}`)}</p>
        <Link legacyBehavior href={href}>
          <a className="inline-block px-2 py-3 mt-4 transition-transform duration-300 rounded-lg shadow-xl 2xl:px-4 bg-palette-primary hover:scale-105 ltr:text-sm rtl:text-xs text-palette-side">
            {t('seeAllProducts')}
          </a>
        </Link>
      </div>
      <Image
        src={imgSrc}
        alt={name}
        width={imgWidth}
        height={imgHeight}
        className="transition-transform duration-300 drop-shadow-lg hover:scale-95 "
      />
    </div>
  )
}

export default CategoryLgBox
