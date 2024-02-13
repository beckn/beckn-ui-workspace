import React from 'react'
import { IconType } from 'react-icons'
import cs from 'classnames'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from 'react-toastify'

type OptionMeta = {
    tagValue: string
    tagName: string
    title?: string
}

type OptionIcons = {
    iconUrl: string
    iconUrlLight: string
}

interface OptionCardProps {
    optionMeta: OptionMeta
    optionIcons: OptionIcons
    isSelected?: boolean
    setOption: React.Dispatch<React.SetStateAction<OptionMeta>>
}

const OptionCard: React.FC<OptionCardProps> = ({
    optionMeta: { tagName, tagValue, title },
    optionIcons: { iconUrl, iconUrlLight },
    isSelected,
    setOption,
}) => {
    const { t } = useLanguage()
    return (
        <div
            className="text-center"
            onClick={(e) => {
                if (
                    tagValue !== 'Books' &&
                    tagValue !== 'restaurant' &&
                    tagValue !== 'Shopping'
                ) {
                    toast.info(`${t.comingSoon}`, {
                        theme: 'light',
                        position: 'top-center',
                        className: 'bg-[#fff] text-[#000]',
                    })
                } else {
                    setOption({ tagName, tagValue })
                }
            }}
        >
            {/* <OptionIcon /> */}
            <div
                className={cs(
                    'mb-2 min-w-[40px] min-h-[40px]  rounded-xl p-3 shadow-custom',
                    { ['bg-palette-primary']: isSelected },
                    { ['bg-white']: !isSelected }
                )}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={isSelected ? iconUrlLight : iconUrl}
                    alt=""
                />
            </div>
            <p
                className={cs('text-xs', {
                    ['text-palette-primary']: isSelected,
                })}
            >
                {t[`${title}`]}
            </p>
        </div>
    )
}

export default OptionCard
