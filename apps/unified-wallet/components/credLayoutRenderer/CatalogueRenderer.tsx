import { useTheme } from '@chakra-ui/react'
import React from 'react'
import ItemRenderer, { ItemMetaData } from './ItemRenderer'

interface CatalogueRendererProps {
  list: ItemMetaData[]
  handleOnClick: (data: ItemMetaData) => void
  handleDeleteItem?: (item: ItemMetaData) => void
}

const CatalogueRenderer = (props: CatalogueRendererProps) => {
  const { list, handleOnClick, handleDeleteItem } = props

  return (
    <>
      {list.map(item => {
        return (
          <>
            <ItemRenderer
              item={item}
              renderMode={'long'}
              handleOnClick={handleOnClick}
              handleDeleteItem={handleDeleteItem}
            />
          </>
        )
      })}
    </>
  )
}

export default CatalogueRenderer
