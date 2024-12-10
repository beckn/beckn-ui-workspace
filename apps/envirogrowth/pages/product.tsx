import React, { useCallback, useRef, useState } from 'react'
import { ProductDetailPage } from '@beckn-ui/becknified-components'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Link, Text, useTheme } from '@chakra-ui/react'
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
    label: '<span style="font-weight:500">Accept</span>',
    value: 'terms'
  }
]

const Product = () => {
  const { t } = useLanguage()
  const selectedProduct: ParsedItemModel = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct)
  const dispatch = useDispatch()
  const router = useRouter()
  const theme = useTheme()
  const [selectedItems, setSelectedItems] = useState<Record<string, DataPoint[]>>({})
  const [isAccepted, setIsAccepted] = useState<boolean>(false)

  const tagSectionOne = useRef(convertProductTagsIntoFormat(selectedProduct.item.tags!, 0))
  const tagSectionTwo = useRef(convertProductTagsIntoFormat(selectedProduct.item.tags!, 1))

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
    const isValid = Object.entries(selectedItems)
      .map(([key, values]) => {
        return values.length >= 1
      })
      .every(option => option === true)

    return isValid && isAccepted
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
          dataTest={testIds.item_title}
        />
        <Typography text={selectedProduct.item.short_desc!} />
        <Typography
          text={selectedProduct.item.productInfo! as string}
          style={{ marginTop: '1rem' }}
          dataTest={testIds.product_page_short_desc}
        />
      </Box>

      <Box
        border={'1px solid #BFBFBF'}
        borderRadius="12px"
        p="16px"
        mb="20px"
      >
        {Object.entries(tagSectionOne.current).map(([key, section]) => (
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
        {Object.entries(tagSectionTwo.current).map(([key, section]) => (
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
      <Flex
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
          sx={{ width: ['4.4rem', '5.4rem'] }}
        />
        <Link
          color={theme.colors.primary[100]}
          fontSize={['12px', '16px']}
          textDecoration="underline"
          href="https://www.google.com"
          data-test={testIds.TermsandConditions_link}
          target="_blank"
        >
          Terms and Conditions
        </Link>
      </Flex>
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
            text="Proceed"
            dataTest={testIds.Proceed_to_product}
            disabled={!checkIsDisabled()}
            handleClick={handleOnProceed}
          />
        </Box>
        ** Contains non-personal data only dataTest={testIds.disclaimer_text}
      </Flex>
    </Box>
  )
}

export default Product
