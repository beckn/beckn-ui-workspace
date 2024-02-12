import React, { useState } from 'react'
import { GoSearch } from 'react-icons/go'
import { useLanguage } from '../../hooks/useLanguage'
import { SearchBarPropsModel } from '../../lib/types/search'

const SearchBar: React.FC<SearchBarPropsModel> = ({
    searchString,
    handleChange,
}) => {
    const { t } = useLanguage()
    const [searchText, setSearchText] = useState(searchString)

    const inputChangeHandler = (event: React.BaseSyntheticEvent) => {
        setSearchText(event.target.value)
    }

    const handleSubmit = () => {
        handleChange(searchText)
    }

    return (
        <div
            className="max-w-[50rem] w-full md:w-[90%] px-4 md:ltr:ml-4 md:rtl:mr-4  dark:bg-slate-800 flex items-center flex-grow border_radius_all  pl-5 "
            style={{
                border: '1px solid #c9c9c9',
                width: 'calc(100% - 40px)',
                margin: '20px auto',
            }}
        >
            <input
                className=" py-2 md:py-3 bg-transparent outline-none w-full"
                type="search"
                placeholder={`${t.search}`}
                onChange={inputChangeHandler}
                value={searchText}
                onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
            />
        </div>
    )
}

export default SearchBar
