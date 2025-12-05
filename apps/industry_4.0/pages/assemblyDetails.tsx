import { LoaderWithMessage } from '@beckn-ui/molecules'
import { Box } from '@chakra-ui/react'
import AssemblyDetails from '@components/assemblyDetails'
import { useLanguage } from '@hooks/useLanguage'
import { getPayloadForSelectRequest } from '@utils/checkout-utils'
import axios from '../services/axios'
import React, { useEffect, useState } from 'react'
import { ParsedItemModel } from '../types/search.types'
import { SelectResponseModel } from '../types/select.types'
import { testIds } from '@shared/dataTestIds'

const assemblyDetails = () => {
  const [selectData, setSelectData] = useState<SelectResponseModel[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ParsedItemModel | null>(null)
  const [isLoadingForSelect, setIsLoadingForSelect] = useState(true)
  const [error, setError] = useState('')
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const updateCatalogue = async (quantity: number, callback: () => void) => {
    // fetchSelectData
    console.log('selectPayload', selectedProduct)
    console.log('quantity', quantity)
    const selectPayload = getPayloadForSelectRequest(selectedProduct as ParsedItemModel, quantity)
    await fetchSelectData(selectPayload, callback)
  }

  const fetchSelectData = (selectPayload: any, callback?: () => void) => {
    setIsLoadingForSelect(true)

    axios
      .post(`${apiUrl}/select`, selectPayload)
      .then(res => {
        const selectData = res.data.data
        localStorage.setItem('selectResponse', JSON.stringify(selectData))
        setSelectData(res.data.data)
        setIsLoadingForSelect(false)
        callback?.()
      })
      .catch(e => {
        setError(e.message)
        console.error(e)
      })
      .finally(() => {
        setIsLoadingForSelect(false)
      })
  }

  useEffect(() => {
    if (localStorage && localStorage.getItem('selectedItem')) {
      const parsedSelectedItem = JSON.parse(localStorage.getItem('selectedItem') as string)
      setSelectedProduct(parsedSelectedItem)
    }
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      const selectPayload = getPayloadForSelectRequest(selectedProduct, 1)
      fetchSelectData(selectPayload)
    }
  }, [selectedProduct])

  if (!selectedProduct) {
    return <></>
  }

  if (isLoadingForSelect) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
        data-test={testIds.loadingIndicator}
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.checkoutLoaderSubText}
        />
      </Box>
    )
  }

  const xInputHtml = selectData[0].message.order.items[0].xinput.html

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      mr={'-20px'}
      ml={'-20px'}
    >
      <AssemblyDetails
        xInputHtml={xInputHtml}
        updateCatalogue={updateCatalogue}
      />
    </Box>
  )
}

export default assemblyDetails
