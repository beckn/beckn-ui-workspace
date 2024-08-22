import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { MdLanguage } from 'react-icons/md'
import { useLanguage } from '../../../hooks/useLanguage'
import LanguageItem from './LanguageItem'
import { Box } from '@chakra-ui/react'
import { settingBoxActions } from '@beckn-ui/common'

const Language = () => {
  const { t, locale } = useLanguage()
  const dispatch = useDispatch()
  const [openLang, setOpenLang] = useState(false)

  function onCloseLangBox(isOpen: boolean) {
    setOpenLang(isOpen)
  }

  return (
    <div className="relative rtl:ml-2 rtl:pl-2 ltr:mr-2 ltr:pr-2">
      <div className="md:hidden">
        <h3>{t.language}</h3>
        <Box mt="8px">
          <LanguageItem
            language="en"
            onCloseBox={() => dispatch(settingBoxActions.closeSettingBox())}
          />
          <LanguageItem
            language="fa"
            onCloseBox={() => dispatch(settingBoxActions.closeSettingBox())}
          />
        </Box>
      </div>

      <Box
        display={'none'}
        onClick={() => setOpenLang(prevState => !prevState)}
      >
        <p className="mx-[0.3rem] text-sm font-bold font-english">{locale === 'en' ? 'En' : 'Fr'}</p>
        <MdLanguage
          style={{
            fontSize: '1.3rem'
          }}
        />
      </Box>
      {openLang ? (
        <>
          <div
            className="fixed inset-0 -z-1"
            onClick={() => setOpenLang(false)}
          ></div>
          <div className={`absolute top-6 ltr:right-0 rtl:left-0 bg-palette-card py-3 px-6 shadow-md rounded-md z-10`}>
            <LanguageItem
              language="fa"
              onCloseBox={onCloseLangBox}
            />
            <LanguageItem
              language="en"
              onCloseBox={onCloseLangBox}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Language
