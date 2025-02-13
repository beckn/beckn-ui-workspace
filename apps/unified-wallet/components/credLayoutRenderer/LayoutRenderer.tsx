import React, { useState, useMemo } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { ButtonProps, InputProps, LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import SearchBar from '@beckn-ui/common/src/components/searchBar'
import EmptyScreenTemplate from '@components/EmptyTemplates/EmptyScreenTemplate'
import AddNewItemModal from '@components/modal/AddNewItemModal'
import { validateCredForm } from '@utils/form-utils'
import EmptyIcon from '@public/images/empty_cred.svg'
import { useLanguage } from '@hooks/useLanguage'
import CatalogueRenderer, { ItemMetaData } from './CatalogueRenderer'
import { DocumentProps } from '@components/documentsRenderer'

export interface FormProps {
  type?: string
  credNumber?: string
  credName?: string
  url?: string
  deviceLocation?: string
  assetsMaker?: string
  modelNumber?: string
  serialNumber?: string
  country?: string
  verificationMethod?: string
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
  country?: string
  verificationMethod?: string
}

export interface CredLayoutRendererProps {
  schema: {
    items: ItemMetaData[]
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
      isLoading?: boolean
      openModal: boolean
      handleOpenModal: () => void
      handleCloseModal: () => void
      renderFileUpload?: boolean
      handleOnFileselectionChange?: (data: DocumentProps[]) => void
    }
  }
}

const CredLayoutRenderer: React.FC<CredLayoutRendererProps> = ({
  schema: {
    items,
    search: { searchInputPlaceholder = 'Search', searchKeyword, setSearchKeyword },
    modal: {
      schema: modalSchema,
      isLoading,
      openModal,
      handleCloseModal,
      handleOpenModal,
      renderFileUpload,
      handleOnFileselectionChange
    }
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
      <Box
        // justifyContent="center"
        // flexDirection={'column'}
        height={'calc(100vh - 200px)'}
        overflowY="scroll"
        className="hideScroll"
      >
        {items.length > 0 ? (
          <CatalogueRenderer list={items} />
        ) : isLoading ? (
          <Box
            display={'grid'}
            height={'calc(100vh - 300px)'}
            alignContent={'center'}
          >
            <LoaderWithMessage
              loadingSubText=""
              loadingText={''}
            />
          </Box>
        ) : (
          <EmptyScreenTemplate
            text={'No identities uploaded yet'}
            description="Click on “+Add New” button to securely add and access your documents anytime"
            src={EmptyIcon}
          />
        )}
      </Box>
      <AddNewItemModal
        isLoading={isLoading}
        isOpen={openModal}
        onClose={handleCloseModal}
        schema={modalSchema}
        renderFileUpload={renderFileUpload}
        handleOnFileselectionChange={handleOnFileselectionChange}
      />
    </Box>
  )
}

export default CredLayoutRenderer
