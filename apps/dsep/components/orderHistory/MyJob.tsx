import { Box, Card, CardBody, Divider, Flex, Text, Image } from '@chakra-ui/react'
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
    <Box>
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
        onClick={props.handleJobsStatus}
      >
        <CardBody padding={'15px 20px'} fontSize="12px">
          <Text fontWeight={'600'} pb={'5px'}>
            {props.heading}
          </Text>
          <Flex alignItems={'center'} justifyContent="space-between" pt={'5px'}>
            <Text pb={'5px'}>
              {t.appliedOn} {props.time}
            </Text>
            <Flex alignItems={'center'}>
              {props.myJobsStatus === 'In Review' ? (
                <Image src="/images/inProgress.svg" alt="" pr="10px" />
              ) : (
                <Image src="/images/approvedIcon.svg" alt="" pr="10px" />
              )}
              <Text>{props.myJobsStatus}</Text>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default MyJob
