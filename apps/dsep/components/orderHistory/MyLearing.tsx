import React from 'react'
import { CurrencyType, DetailCard, ProductPrice } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'

interface Price {
  currency: CurrencyType
  value: string
}

interface MyLearningProps {
  heading: string
  time: string
  id: string
  price: Price
  myLearingStatus: string
  handleViewCourses: () => void
}

const MyLearing: React.FC<MyLearningProps> = props => {
  const { t } = useLanguage()
  const { currency, value } = props.price
  return (
    <DetailCard>
      <Typography
        dataTest={testIds.myLearning_headingText}
        text={props.heading}
        fontWeight={'600'}
        style={{
          paddingBottom: '10px'
        }}
      />
      <Typography
        dataTest={testIds.myLearning_createdAt}
        text={props.time}
        style={{
          paddingBottom: '5px'
        }}
      />
      <Typography
        dataTest={testIds.myLearning_order_id}
        text={`ID: ${props.id}`}
        style={{
          paddingRight: '10px'
        }}
      />

      <Flex
        alignItems={'center'}
        justifyContent="space-between"
        pt={'5px'}
      >
        <ProductPrice
          price={parseFloat(value)}
          currencyType={currency}
          color={'black'}
        />
        <Flex alignItems={'center'}>
          {props.myLearingStatus === 'In Review' ? (
            <Image
              src="/images/inProgress.svg"
              alt="in progress icon"
              pr="10px"
            />
          ) : (
            <Image
              src="/images/approvedIcon.svg"
              alt="approved icon"
              pr="10px"
            />
          )}
          <Typography text={props.myLearingStatus} />
        </Flex>
      </Flex>
      <Divider
        mt={'15px'}
        marginLeft="-20px"
        mr={'-20px'}
        width="unset"
      />
      <Box
        data-test={testIds.view_course_btn}
        textAlign={'center'}
        padding="10px 10px 0"
        fontSize={'15px'}
        cursor="pointer"
        color={'rgba(var(--color-primary))'}
        onClick={props.handleViewCourses}
      >
        {t.viewCourse}
      </Box>
    </DetailCard>
  )
}

export default MyLearing
