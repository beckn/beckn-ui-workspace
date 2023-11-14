import type { NextPage } from 'next'
import { useLanguage } from '../hooks/useLanguage'
// import Image from 'next/image'
import { Image } from '@chakra-ui/react'
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri'

const About: NextPage = () => {
  const { t, locale } = useLanguage()
  const StartQuot = locale === 'en' ? RiDoubleQuotesL : RiDoubleQuotesR
  const EndQuot = locale === 'en' ? RiDoubleQuotesR : RiDoubleQuotesL
  return (
    <div className="flex w-full xl:max-w-[2100px] mx-auto">
      <div className="w-full px-4 mt-8 lg:w-1/2 md:mt-0 sm:px-8 md:px-0">
        <p className="leading-8 md:text-justify">{t('aboutLongText')}</p>
        <br />
        <p>
          <StartQuot
            style={{
              display: 'inline',
              verticalAlign: 'top',
              fontSize: '0.8rem',
              color: '#A71B4A'
            }}
          />
          {t('cafeDX')}
          <EndQuot
            style={{
              display: 'inline',
              verticalAlign: 'top',
              fontSize: '0.8rem',
              color: '#A71B4A'
            }}
          />
          &nbsp;
          <a
            href="https://cafedx.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 font-bold underline text-palette-side bg-palette-primary"
          >
            CafeDX
          </a>
        </p>
        <p className="my-4">{t('aboutEnjoy')}</p>
        <p>{t('myName')}</p>
      </div>
      <div className="flex-grow hidden text-center md:block">
        <Image
          src="/images/about-me.svg"
          alt="about me"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
    </div>
  )
}

export default About
