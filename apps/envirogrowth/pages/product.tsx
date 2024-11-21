import React, { useCallback, useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { DiscoveryRootState, ParsedItemModel } from '@beckn-ui/common/lib/types'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { testIds } from '@shared/dataTestIds'
import { OptionsGroup } from '@beckn-ui/common'
import { Button, Typography } from '@beckn-ui/molecules'
import { mockData1, mockData2 } from '../mock/mockOptionGroupData'
import { DataPoint } from '@beckn-ui/common/src/components/OptionsGroup'
import { useRouter } from 'next/router'
import { convertProductTagsIntoFormat, getSelectedProductDetails } from '../utils/product-utils'

const terms = [
  {
    label:
      '<span style="font-weight:500">Accept <a style="color:#8A7012; text-decoration: underline">Terms and Conditions</a></span>',
    value: 'terms'
  }
]

const Product = () => {
  const { t } = useLanguage()
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<Record<string, DataPoint[]>>({})
  const [isAccepted, setIsAccepted] = useState<boolean>(false)

  const handleSelectionChange = useCallback((sectionKey: string, selectedValues: DataPoint[]) => {
    setSelectedItems(prevItems => {
      if (JSON.stringify(prevItems[sectionKey]) === JSON.stringify(selectedValues)) {
        return prevItems
      }
      return {
        ...prevItems,
        [sectionKey]: selectedValues
      }
    })
  }, [])

  const handleOnProceed = () => {
    let dataObjectsArray: any = getSelectedProductDetails(selectedItems)
    console.log(dataObjectsArray, selectedProduct)
    dispatch(
      cartActions.addItemToCart({
        product: { ...selectedProduct, item: { ...selectedProduct.item, tags: dataObjectsArray } },
        quantity: 0
      })
    )
    dispatch(
      feedbackActions.setToastData({
        toastData: { message: 'Success', display: true, type: 'success', description: t.addedToCart }
      })
    )
    router.push('/cart')
  }

  const checkIsDisabled = () => {
    return Object.values(selectedItems).flatMap(data => data).length > 0 && isAccepted
  }

  if (!selectedProduct) {
    return <></>
  }
  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <ProductDetailPage
        schema={{
          productSummary: {
            imageSrc: selectedProduct.item?.images?.[0].url!,
            name: selectedProduct.item.name,
            providerName: selectedProduct.providerName,
            secondaryDescription: selectedProduct.item.long_desc,
            dataTestTitle: testIds.item_title,
            dataTestDescription: testIds.item_description,
            className: 'envirogrowth-product',
            starRating: {
              rating: selectedProduct.item.rating!,
              size: 20,
              setRating: () => {},
              starCount: 5,
              dataTest: testIds.item_rating
            }
          }
        }}
      />
      <Box
        border={'1px solid #BFBFBF'}
        borderRadius="12px"
        p="16px"
        mb="20px"
      >
        <Typography
          text={`About ${selectedProduct.providerName}`}
          fontWeight={'800'}
        />
        <Typography text={selectedProduct.item.short_desc!} />
        <Typography
          text={selectedProduct.item.productInfo! as string}
          style={{ marginTop: '1rem' }}
        />
      </Box>

      <Box
        border={'1px solid #BFBFBF'}
        borderRadius="12px"
        p="16px"
        mb="20px"
      >
        {Object.entries(convertProductTagsIntoFormat(selectedProduct.item.tags!, 0)).map(([key, section]) => (
          <Box
            key={key}
            mb="30px"
          >
            <OptionsGroup
              types={section.type}
              dataPoints={section.options}
              heading={section.heading}
              handleSelectionChange={selectedValues => handleSelectionChange(key, selectedValues)}
              multiSelect={section.type === 'checkbox'}
            />
          </Box>
        ))}
      </Box>

      <Box
        border={'1px solid #BFBFBF'}
        borderRadius="12px"
        p="16px"
        mb="20px"
      >
        {Object.entries(convertProductTagsIntoFormat(selectedProduct.item.tags!, 1)).map(([key, section]) => (
          <Box
            key={key}
            mb="30px"
          >
            <OptionsGroup
              types={section.type}
              dataPoints={section.options}
              heading={section.heading}
              handleSelectionChange={selectedValues => handleSelectionChange(key, selectedValues)}
              multiSelect={section.type === 'checkbox'}
            />
          </Box>
        ))}
      </Box>
      <Box
        border={'1px solid #BFBFBF'}
        borderRadius="12px"
        p="16px"
        mb="20px"
      >
        <OptionsGroup
          types={'checkbox'}
          dataPoints={terms}
          handleSelectionChange={value => {
            setIsAccepted(value.length > 0)
          }}
        />
      </Box>
      <Flex
        alignItems={'center'}
        border={'1px solid #BFBFBF'}
        borderRadius="12px"
        p="16px 16px 6px 16px"
        display={['block', 'flex']}
      >
        <Box
          w="307px"
          mr="20px"
        >
          <Button
            text="proceed"
            disabled={!checkIsDisabled()}
            handleClick={handleOnProceed}
          />
        </Box>
        ** Contains non-personal data only
      </Flex>
    </Box>
  )
}

export default Product
