import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'

interface MyJobsProps {
  heading: string
  time: string
  myJobsStatus: string
  handleJobsStatus: () => void
}

const MyJob: React.FC<MyJobsProps> = props => {
  const { t } = useLanguage()
  return (
    <Box
      onClick={props.handleJobsStatus}
      data-test={testIds.jobOrder_history_card}
    >
      <DetailCard>
        <Typography
          text={props.heading}
          fontWeight={'600'}
          style={{
            paddingBottom: '5px'
          }}
          dataTest={testIds.jobCardHeading}
        />
        <Flex
          alignItems={'center'}
          justifyContent="space-between"
          pt={'5px'}
        >
          <Typography
            style={{
              paddingBottom: '5px'
            }}
            text={`${t.appliedOn} ${props.time}`}
            dataTest={testIds.jobCardTime}
          />
          <Flex
            alignItems={'center'}
            data-test={testIds.image_container_forJob_action}
          >
            {props.myJobsStatus === 'In Review' ? (
              <Image
                src="/images/inProgress.svg"
                alt="in progress icon"
                pr="10px"
              />
            ) : (
              <Image
                src="/images/approvedIcon.svg"
                alt="approve icon"
                pr="10px"
              />
            )}
            <Typography
              text={props.myJobsStatus}
              dataTest={testIds.jobCardStatus}
            />
          </Flex>
        </Flex>
      </DetailCard>
    </Box>
  )
}

export default MyJob
