import { Box, Card, CardBody, Divider, Flex, Text, Image } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'

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
    <Box>
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody padding={'15px 20px'} fontSize="12px">
          <Text fontWeight={'600'} pb={'10px'}>
            {props.heading}
          </Text>
          <Text pb={'5px'}>{props.time}</Text>
          <Flex alignItems={'center'} justifyContent="space-between">
            <Text pr={'10px'}>ID: {props.id}</Text>
            <Flex alignItems={'center'}>
              {props.scholarshipStatus === 'In Review' ? (
                <Image src="/images/inProgress.svg" alt="" pr="10px" />
              ) : (
                <Image src="/images/approvedIcon.svg" alt="" pr="10px" />
              )}
              <Text>{props.scholarshipStatus}</Text>
            </Flex>
          </Flex>
          {props.scholarshipStatus === 'Approved' ? (
            <>
              <Divider mt={'15px'} marginLeft="-20px" mr={'-20px'} width="unset" />
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
        </CardBody>
      </Card>
    </Box>
  )
}

export default ScholarshipCard
