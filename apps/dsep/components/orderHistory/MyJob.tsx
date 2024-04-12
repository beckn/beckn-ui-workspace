import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface MyJobsProps {
  heading: string
  time: string
  myJobsStatus: string
  handleJobsStatus: () => void
}

const MyJob: React.FC<MyJobsProps> = props => {
  const { t } = useLanguage()
  return (
    <DetailCard>
      <Typography
        text={props.heading}
        fontWeight={'600'}
        style={{
          paddingBottom: '5px'
        }}
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
        />
        <Flex alignItems={'center'}>
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
          <Typography text={props.myJobsStatus} />
        </Flex>
      </Flex>
    </DetailCard>
  )
}

export default MyJob
