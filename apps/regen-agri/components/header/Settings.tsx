import React from 'react'
import { AiOutlineSetting, AiOutlineDown } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { settingBoxActions } from '../../store/settingBox-slice'
import Language from './language/Language'
import { useLanguage } from '../../hooks/useLanguage'
import { ISettingBoxRootState } from '../../lib/types/settingBox'

// Settings is just Language selector for now
const Settings = () => {
    const dispatch = useDispatch()
    const { t, locale } = useLanguage()

    const isSettingBoxOpen = useSelector(
        (state: ISettingBoxRootState) => state.settingBox.isOpen
    )

    function toggleShowSettingBox() {
        dispatch(settingBoxActions.toggleSettingBox())
    }

    function onCloseSettingBox() {
        dispatch(settingBoxActions.closeSettingBox())
    }

    return (
        <div className="relative md:hidden flex justify-between items-center z-[9999]">
            <div
                className="flex items-center"
                onClick={toggleShowSettingBox}
            >
                <span className="capitalize text-sm">
                    {locale == 'en' ? 'En' : 'Fr'}
                </span>
                <AiOutlineDown
                    style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}
                />
            </div>
            {isSettingBoxOpen ? (
                <>
                    <div
                        className="fixed inset-0  bg-black/20"
                        onClick={onCloseSettingBox}
                    ></div>
                    <div className="absolute right-0 top-8 ltr:right-0 rtl:left-0 bg-palette-card shadow-md rounded-lg px-6 py-3 z-[9999] ">
                        <Language />
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default Settings
