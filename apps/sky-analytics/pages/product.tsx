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
import { Button } from '@beckn-ui/molecules'
import { mockData1, mockData2 } from '../mock/mockOptionGroupData'
import { DataPoint } from '@beckn-ui/common/src/components/OptionsGroup'
import { useRouter } from 'next/router'

const terms = [
  {
    label:
      '<span style="font-weight:500">Accept <a style="color:#2C5D86; text-decoration: underline">Terms and Conditions</a></span>',
    value: 'terms'
  }
]

const Product = () => {
  const { t } = useLanguage()
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()
  const [selectedItems, setSelectedItems] = useState<Record<string, DataPoint[]>>({})

  const handleSelectionChange = useCallback((sectionKey: string, selectedValues: DataPoint[]) => {
    setSelectedItems(prevItems => {
      // Check if there is any difference before updating the state
      if (JSON.stringify(prevItems[sectionKey]) === JSON.stringify(selectedValues)) {
        return prevItems // No change, so return previous state
      }
      return {
        ...prevItems,
        [sectionKey]: selectedValues
      }
    })
  }, [])

  console.log(selectedItems)

  const router = useRouter()
  // if (!selectedProduct) {
  //   return <></>
  // }
  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <ProductDetailPage
        schema={{
          productSummary: {
            imageSrc: selectedProduct.item.images?.[0].url!,
            name: selectedProduct.item.name,
            secondaryDescription: selectedProduct.item.long_desc,
            dataTestTitle: testIds.item_title,
            dataTestDescription: testIds.item_description,
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
        {Object.entries(mockData1).map(([key, section]) => (
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
        {Object.entries(mockData2).map(([key, section]) => (
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
          handleSelectionChange={() => {}}
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
            handleClick={() => {
              dispatch(
                cartActions.addItemToCart({
                  product: selectedProduct,
                  quantity: 0
                })
              )
            }}
          />
        </Box>
        ** Contains non-personal data only
      </Flex>
    </Box>
  )
}

export default Product
// handleClick: () => {
//   dispatch(
//     cartActions.addItemToCart({
//       product: selectedProduct,
//       quantity: counter
//     })
//   )
//   dispatch(
//     feedbackActions.setToastData({
//       toastData: { message: 'Success', display: true, type: 'success', description: t.addedToCart }
//     })
//   )
// }
