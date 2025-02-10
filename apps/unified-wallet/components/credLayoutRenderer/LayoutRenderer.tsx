import React, { useState, useMemo } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { ButtonProps, InputProps, Typography } from '@beckn-ui/molecules'
import SearchBar from '@beckn-ui/common/src/components/searchBar'
import EmptyScreenTemplate from '@components/currentTrade/EmptyScreenTemplate'
import AddNewItemModal from '@components/modal/AddNewItemModal'
import { validateCredForm } from '@utils/form-utils'
import EmptyIcon from '@public/images/empty_cred.svg'
import { useLanguage } from '@hooks/useLanguage'

export interface FormProps {
  type?: string
  credNumber?: string
  credName?: string
  url?: string
  deviceLocation?: string
  assetsMaker?: string
  modelNumber?: string
  serialNumber?: string
}

export interface CredFormErrors {
  type?: string
  credNumber?: string
  credName?: string
  url?: string
  deviceLocation?: string
  assetsMaker?: string
  modelNumber?: string
  serialNumber?: string
}

export interface CredLayoutRendererProps {
  schema: {
    items: { id: number; name: string; paired?: boolean }[]
    search: {
      searchInputPlaceholder?: string
      searchKeyword: string
      setSearchKeyword: React.Dispatch<React.SetStateAction<string>>
    }
    modal: {
      schema: {
        header: string
        inputs: InputProps[]
        buttons: ButtonProps[]
      }
      openModal: boolean
      handleOpenModal: () => void
      handleCloseModal: () => void
      renderFileUpload?: boolean
    }
  }
}

const CredLayoutRenderer: React.FC<CredLayoutRendererProps> = ({
  schema: {
    items,
    search: { searchInputPlaceholder = 'Search', searchKeyword, setSearchKeyword },
    modal: { schema: modalSchema, openModal, handleCloseModal, handleOpenModal, renderFileUpload }
  }
}) => {
  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="calc(0rem + 0px) auto auto auto"
      backgroundColor="white"
    >
      <Box
        display="flex"
        alignItems="center"
      >
        <SearchBar
          searchString={searchKeyword}
          placeholder={searchInputPlaceholder}
          handleChange={(text: string) => setSearchKeyword(text)}
        />
        <Flex
          onClick={handleOpenModal}
          cursor="pointer"
          marginLeft={'1rem'}
          alignItems="center"
          whiteSpace={'nowrap'}
          backgroundColor="#09BD71"
          padding="5px 10px"
          borderRadius="6px"
        >
          <Typography
            text="+"
            color="#FFFFFF"
            fontSize="20px"
            style={{ marginRight: '4px' }}
          />
          <Typography
            text="Add New"
            color="#FFFFFF"
          />
        </Flex>
      </Box>
      <Flex justifyContent="center">
        {items.length > 0 ? null : (
          <EmptyScreenTemplate
            text={'No identities uploaded yet'}
            description="Click on “+Add New” button to securely add and access your documents anytime"
            src={EmptyIcon}
          />
        )}
      </Flex>
      <AddNewItemModal
        isOpen={openModal}
        onClose={handleCloseModal}
        schema={modalSchema}
        renderFileUpload={renderFileUpload}
      />
    </Box>
  )
}

export default CredLayoutRenderer
