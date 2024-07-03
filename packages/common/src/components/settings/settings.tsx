import React from 'react'
import { AiOutlineDown } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import Language from './language/Language'
import Styles from './settings.module.css'
import { ISettingBoxRootState } from '@beckn-ui/common/lib/types'
import { settingBoxActions } from '@beckn-ui/common/src/store/settingBox-slice'
import { TranslationProps } from './settings.types'

// Settings is just Language selector for now
const Settings = (props: TranslationProps) => {
  const { t, locale } = props

  const dispatch = useDispatch()

  const isSettingBoxOpen = useSelector((state: ISettingBoxRootState) => state.settingBox.isOpen)

  function toggleShowSettingBox() {
    dispatch(settingBoxActions.toggleSettingBox())
  }

  function onCloseSettingBox() {
    dispatch(settingBoxActions.closeSettingBox())
  }

  return (
    <div className={Styles.language_toggle_wrapper}>
      <div
        className={Styles.language_toggle}
        onClick={toggleShowSettingBox}
      >
        <span className="capitalize text-sm">{locale == 'en' ? 'En' : 'Fr'}</span>
        <AiOutlineDown
          style={{
            fontSize: '0.8rem',
            marginTop: '0.2rem'
          }}
        />
      </div>
      {isSettingBoxOpen ? (
        <>
          <div
            className="fixed inset-0  bg-black/20"
            onClick={onCloseSettingBox}
          ></div>
          <div className={Styles.language_modal}>
            <Language t={t} />
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Settings
