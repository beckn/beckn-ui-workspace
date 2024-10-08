import { Typography } from '@beckn-ui/molecules'
import { Flex, Text, Card, CardBody } from '@chakra-ui/react'
import { testIds } from '@shared/dataTestIds'
import Link from 'next/link'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { ParsedItemModel } from '../../types/search.types'
import { toBinary } from '../../utilities/common-utils'
import { JobInfo } from './JobsSearch.types'

const JobCardRenderer = (props: any) => {
  const dataSource: ParsedItemModel = props.dataSource
  const { providerName, item, cityName } = dataSource
  const { name } = item
  const { t } = useLanguage()
  const encodedjob = window.btoa(toBinary(JSON.stringify(dataSource)))
  return (
    <Link
      href={{
        pathname: '/jobDetails',
        query: { jobDetails: encodedjob }
      }}
      data-test={testIds.job_detail_link}
    >
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody
          padding={'15px 20px'}
          fontSize="12px"
        >
          <Flex
            gap={'10px'}
            direction={'column'}
            justifyContent={'center'}
          >
            <Typography
              fontWeight={'600'}
              text={name}
              dataTest={testIds.job_name}
            />
            <Typography
              text={providerName}
              dataTest={testIds.job_providerName}
            />
            <Typography
              text={cityName as string}
              dataTest={testIds.job_cityName}
            />

            <Typography
              fontWeight="600"
              text={`${t.jobsBy} ${providerName}`}
              dataTest={testIds.jobBy_providername}
            />
          </Flex>
        </CardBody>
      </Card>
    </Link>
  )
}

export default JobCardRenderer
