import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { TranslationProps } from '../settings.types'

interface Props extends TranslationProps {
  language: string
  onCloseBox: (isLangOpen: boolean) => void
}

const LanguageItem: React.FC<Props> = props => {
  const { t, locale, language, onCloseBox } = props
  const router = useRouter()
  const [lang, setLang] = useState(locale)

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setLang(e.currentTarget.id)
  }

  return (
    <Link
      legacyBehavior
      href={`${router.asPath}`}
      locale={language}
    >
      <Box
        pb={['4px', '8px']}
        pt={['4px', '8px']}
      >
        <a>
          <div
            className="flex items-center"
            onClick={() => onCloseBox(false)}
          >
            <input
              type="radio"
              id={language}
              name="language"
              value={lang}
              className="block accent-rose-600"
              checked={locale === language ? true : false}
              onChange={onChangeHandler}
            />
            <label
              htmlFor={language}
              style={{ padding: '0 12px', fontWeight: `${locale === language && 'bold'}` }}
            >
              {t(language)}
            </label>
          </div>
        </a>
      </Box>
    </Link>
  )
}

export default LanguageItem
