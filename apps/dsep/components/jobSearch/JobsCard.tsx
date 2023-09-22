import { Flex, Text, Card, CardBody } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface JobsCardProps {
  position: string
  companyName: string
  location: string
  platformName: string
  handleJobsCard: () => void
}

const JobsCard: React.FC<JobsCardProps> = props => {
  const { t } = useLanguage()
  return (
    <Card
      onClick={props.handleJobsCard}
      className="border_radius_all"
      mb={'20px'}
      boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
    >
      <CardBody padding={'15px 20px'} fontSize="12px">
        <Flex direction={'column'} justifyContent={'center'}>
          <Text fontWeight={600} fontSize={'15px'} pb={'10px'}>
            {props.position}
          </Text>
          <Text pb={'10px'}>{props.companyName}</Text>
          <Text pb={'10px'}>{props.location}</Text>
          <Text>
            <span style={{ fontWeight: 600 }}>{t.jobsBy}</span> {props.platformName}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default JobsCard
