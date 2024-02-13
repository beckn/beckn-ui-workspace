import React, { ChangeEvent } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { BsFilterLeft, BsArrowDown } from 'react-icons/bs'
import { radioBtnValue } from '../../mock/sortRadioInput'
import { Box } from '@chakra-ui/react'

interface Props {
    selectedBtn: string
    onChangeSelectedBtn: (e: ChangeEvent<HTMLInputElement>) => void
}
const Sort: React.FC<Props> = ({
    selectedBtn: selectedRadioBtn,
    onChangeSelectedBtn,
}) => {
    const { t } = useLanguage()

    const isRadioSelected = (value: string): boolean =>
        value === selectedRadioBtn ? true : false

    return (
        <Box
            mt={'-106px'}
            position={'fixed'}
            zIndex={'8'}
            background={'#fff'}
            padding={'20px 0 0 0'}
            width={'100%'}
            ml={'-20px'}
        >
            <div
                className="my-4 pb-2 flex flex-wrap border-b-2 border-slate-300"
                style={{
                    marginTop: '15px',
                    width: 'calc(100% - 40px)',
                    margin: '0 auto',
                }}
            >
                <div
                    className="flex items-center"
                    style={{ fontSize: '15px' }}
                >
                    <div
                        className="flex items-center"
                        style={{ fontSize: '12px' }}
                    >
                        <BsFilterLeft
                            style={{ fontSize: '1.5rem', paddingRight: '5px' }}
                        />
                    </div>
                    <h5 className="ltr:ml-1 rtl:mr-1">{t.sort}</h5>
                </div>

                <div
                    className="flex flex-wrap items-center"
                    style={{ marginTop: '5px' }}
                >
                    {radioBtnValue.map((radioInput) => {
                        return (
                            <div
                                key={radioInput}
                                className="px-2 md:px-2 mx-2 my-1 sm:my-0"
                                style={{ marginRight: 'unset !important' }}
                            >
                                <label
                                    htmlFor={radioInput}
                                    className={`text-sm  cursor-pointer ${
                                        radioInput === selectedRadioBtn
                                            ? 'text-palette-primary font-bold'
                                            : 'text-palette-mute/80 hover:text-palette-base transition-all'
                                    }`}
                                >
                                    {t[radioInput]}
                                </label>
                                <input
                                    type="radio"
                                    className="hidden"
                                    id={radioInput}
                                    value={selectedRadioBtn}
                                    name="sortProduct"
                                    checked={isRadioSelected(radioInput)}
                                    onChange={onChangeSelectedBtn}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </Box>
    )
}

export default Sort
