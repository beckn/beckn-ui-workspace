import { Flex, Text, Card } from '@chakra-ui/react'
import React from 'react'
import Styles from './JobSearch.module.css'
import { useLanguage } from '../../hooks/useLanguage'

interface ResponseProps {
  position?: string
  companyName?: string
  location?: string
  platformName?: string
}

interface JobsCardProps {
  response: ResponseProps
}

const JobsCard = (props: JobsCardProps) => {
  const { t } = useLanguage()
  return (
    <Card
      className="border_radius_all"
      mb={'20px'}
      boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      width={'335px'}
    >
      <Flex className={Styles.jobsFlex} direction={'column'} justifyContent={'center'}>
        <Text className={Styles.jobsText} fontWeight={600} fontSize={'15px'}>
          {props.response.position}
        </Text>
        <Text className={Styles.jobsText}>{props.response.companyName}</Text>
        <Text className={Styles.jobsText}>{props.response.location}</Text>
        <Text className={Styles.jobsText}>
          <span style={{ fontWeight: 600 }}>{t.jobsBy}</span> {props.response.platformName}
        </Text>
      </Flex>
    </Card>
  )
}

export default JobsCard
