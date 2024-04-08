import React from 'react'
import { FaSearch } from 'react-icons/fa'
import Styles from './GeoLocationInput.module.css'
import { Flex } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'

interface HomeSearchInputPropsModel {
    setSearchInputValue: (searchString: string) => void
    searchInputValue: string
    homeSearchInputButtonHandler: Function
}

const GeoLocationInput: React.FC<HomeSearchInputPropsModel> = ({
    setSearchInputValue,
    searchInputValue,
    homeSearchInputButtonHandler,
}) => {
    const setlocalStorageValue = () => {
        localStorage.setItem('selectCardHeaderText', searchInputValue)
    }
    const { t } = useLanguage()
    return (
        <>
            <Flex className={Styles.flex_container}>
                <Flex className={Styles.flex_input_group}>
                    <input
                        className={Styles.input_box}
                        name="search_input"
                        placeholder={t.searchForanything}
                        type="text"
                        onChange={(e) => {
                            setSearchInputValue(e.target.value)
                        }}
                        value={searchInputValue}
                        onKeyDownCapture={(e) => {
                            if (searchInputValue.trim().length) {
                                if (e.code === 'Enter') {
                                    homeSearchInputButtonHandler()
                                    setlocalStorageValue()
                                }
                            }
                        }}
                    />
                    <button
                        disabled={!searchInputValue.length}
                        onClick={() => {
                            homeSearchInputButtonHandler()
                            setlocalStorageValue()
                        }}
                        className={Styles.search_button}
                    >
                        <FaSearch />
                    </button>
                </Flex>
            </Flex>
        </>
    )
}
export default GeoLocationInput
