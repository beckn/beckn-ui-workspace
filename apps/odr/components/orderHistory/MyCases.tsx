import { Box, Card, CardBody, Divider, Flex, Text, Image } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface MyCasesProps {
  heading: string
  time: string
  id: string
  myLearingStatus: string
  handleViewCaseDetails: () => void
}

const MyCases: React.FC<MyCasesProps> = props => {
  const { t } = useLanguage()
  return (
    <Box>
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody
          padding={'15px 20px'}
          fontSize="12px"
        >
          <Text
            fontWeight={'600'}
            pb={'10px'}
          >
            {props.heading}
          </Text>
          <Text
            fontWeight={'400'}
            pb={'10px'}
          >
            Harvey Spectre Law Firm
          </Text>

          <Text pr={'10px'}>
            {' '}
            <span style={{ fontSize: '12px', fontWeight: 700 }}>CaseID: </span>
            {props.id}
          </Text>

          <Flex
            alignItems={'center'}
            justifyContent="space-between"
            pt={'5px'}
          >
            <Text pb={'5px'}>{props.time}</Text>
            <Flex alignItems={'center'}>
              {props.myLearingStatus === 'In Review' ? (
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
              <Text>{props.myLearingStatus}</Text>
            </Flex>
          </Flex>
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
            fontWeight={600}
            cursor="pointer"
            color={'rgba(var(--color-primary))'}
            onClick={props.handleViewCaseDetails}
          >
            {t.viewCase}
          </Box>
        </CardBody>
      </Card>
    </Box>
  )
}

export default MyCases
