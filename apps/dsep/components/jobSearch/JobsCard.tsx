import { Flex, Text, Card, CardBody } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { toBinary } from '../../utilities/common-utils'
import { JobInfo } from './JobsSearch.types'

interface JobsCardProps {
  job: JobInfo
}

const JobsCard: React.FC<JobsCardProps> = props => {
  const { t } = useLanguage()
  const { job } = props
  const encodedjob = window.btoa(toBinary(JSON.stringify(job)))
  return (
    <Link
      href={{
        pathname: '/jobDetails',
        query: { jobDetails: encodedjob }
      }}
    >
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody padding={'15px 20px'} fontSize="12px">
          <Flex direction={'column'} justifyContent={'center'}>
            <Text fontWeight={600} fontSize={'15px'} pb={'10px'}>
              {job.jobRole}
            </Text>
            <Text pb={'10px'}>{job.companyName}</Text>
            <Text pb={'10px'}>{job.location}</Text>
            <Text>
              <span style={{ fontWeight: 600 }}>{t.jobsBy}</span> {job.platformName}
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </Link>
  )
}

export default JobsCard
