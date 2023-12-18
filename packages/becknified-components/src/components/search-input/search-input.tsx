import React from 'react'
import { Flex, Input, Image, useTheme } from '@chakra-ui/react'
import { SearchInputPropsModel } from './search-input.types'

const SearchInput: React.FC<SearchInputPropsModel> = props => {
  const theme = useTheme()

  const {
    onChangeHandler,
    searchIcon,
    searchIconClickHandler,
    className = '',
    name = 'search_input',
    placeHolder = 'Search for items',
    onEnterHandler
  } = props

  const bgColorOfSearchIcon = theme.colors.primary['100']

  return (
    <Flex>
      <Input
        className={`${className}-search-input`}
        boxShadow="0px 0px 24px rgba(0, 0, 0, 0.10)"
        borderRightRadius={'unset'}
        p={'26px 15px'}
        type="text"
        name={name}
        placeholder={placeHolder}
        onChange={onChangeHandler}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && onEnterHandler(event)}
        _focusVisible={{
          borderColor: 'transparent',
          boxShadow: 'transparent'
        }}
      />
      <Flex
        className={`${className}-search-icon-container`}
        bg={bgColorOfSearchIcon}
        borderRightRadius={'6px'}
        boxShadow="0px 0px 24px rgba(0, 0, 0, 0.10)"
        justifyContent={'center'}
        alignItems="center"
        width={'55px'}
      >
        <Image
          src={searchIcon}
          onClick={searchIconClickHandler}
          alt={'search_icon'}
        />
      </Flex>
    </Flex>
  )
}

export default SearchInput
