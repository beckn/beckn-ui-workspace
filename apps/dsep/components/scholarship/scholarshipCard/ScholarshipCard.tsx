import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'

interface ScholarshipCardProps {
  heading: string
  time: string
  id: string
  scholarshipStatus: string
  addScholarshipCard: () => void
}

const ScholarshipCard: FC<ScholarshipCardProps> = props => {
  const { t } = useLanguage()
  return (
    <DetailCard>
      <Flex
        pb={'10px'}
        flexDir={'column'}
        gap={'10px'}
      >
        <Typography
          text={props.heading}
          fontWeight={'600'}
          dataTest={testIds.scholarshipCardHeading}
        />
        <Typography
          text={props.time}
          dataTest={testIds.scholarshipCardTime}
        />
      </Flex>

      <Flex
        alignItems={'center'}
        justifyContent="space-between"
      >
        <Typography
          text={`ID: ${props.id}`}
          style={{
            paddingRight: '10px'
          }}
          dataTest={testIds.scholarshipCardID}
        />

        <Flex alignItems={'center'}>
          {props.scholarshipStatus === 'In Review' ? (
            <Image
              src="/images/inProgress.svg"
              alt=""
              pr="10px"
            />
          ) : (
            <Image
              src="/images/approvedIcon.svg"
              alt=""
              pr="10px"
            />
          )}
          <Typography text={props.scholarshipStatus} />
        </Flex>
      </Flex>
      {props.scholarshipStatus === 'Approved' ? (
        <>
          <Divider
            mt={'15px'}
            marginLeft="-20px"
            mr={'-20px'}
            width="unset"
          />
          <Box
            textAlign={'center'}
            padding="10px 10px 0"
            fontSize={'15px'}
            cursor="pointer"
            color={'rgba(var(--color-primary))'}
            onClick={props.addScholarshipCard}
          >
            {t.add}
          </Box>
        </>
      ) : null}
    </DetailCard>
  )
}

export default ScholarshipCard
