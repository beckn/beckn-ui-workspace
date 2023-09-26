import React from 'react'
// import Image from 'next/image'
import { Image } from '@chakra-ui/react'
import Link from 'next/link'
import { useLanguage } from '../../hooks/useLanguage'

interface Props {
  imgSrc: string
  bgc: string
  categoryTitle: string
  href: string
}
const CategorySmBox: React.FC<Props> = ({ imgSrc, bgc, categoryTitle, href }) => {
  const { t, locale } = useLanguage()
  return (
    <Link
      href={{
        pathname: '/search',
        query: { keyword: t(`${categoryTitle}`) }
      }}
    >
      <a>
        <div
          className={`flex flex-col items-center text-center  ${
            locale === 'en' ? 'w-[10rem] sm:w-[13rem]' : 'min-w-[7rem] w-[9.3rem] sm:w-[10rem]'
          } my-2`}
        >
          <div className={`flex items-center justify-center w-[60px] h-[60px] rounded-full bg-palette-${bgc}`}>
            <Image
              src={`/images/category-icon/${imgSrc}`}
              alt={categoryTitle}
              width={143}
              height={111}
              className="drop-shadow-lg"
            />
          </div>
          <h3 className="mt-2 text-sm font-bold md:text-base">{t(`${categoryTitle}`)}</h3>
        </div>
      </a>
    </Link>
  )
}

export default CategorySmBox
