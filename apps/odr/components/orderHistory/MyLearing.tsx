import { Box, Card, CardBody, Divider, Flex, Text, Image } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface MyLearningProps {
  heading: string
  time: string
  id: string
  myLearingStatus: string
  handleViewCourses: () => void
}

const MyLearing: React.FC<MyLearningProps> = props => {
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

          <Text pr={'10px'}>ID: {props.id}</Text>

          <Flex alignItems={'center'} justifyContent="space-between" pt={'5px'}>
            <Text fontWeight={'600'}>{t.currencySymbol} 1000</Text>
            <Flex alignItems={'center'}>
              {props.myLearingStatus === 'In Review' ? (
                <Image src="/images/inProgress.svg" alt="" pr="10px" />
              ) : (
                <Image src="/images/approvedIcon.svg" alt="" pr="10px" />
              )}
              <Text>{props.myLearingStatus}</Text>
            </Flex>
          </Flex>
          <Divider mt={'15px'} marginLeft="-20px" mr={'-20px'} width="unset" />
          <Box
            textAlign={'center'}
            padding="10px 10px 0"
            fontSize={'15px'}
            cursor="pointer"
            color={'rgba(var(--color-primary))'}
            onClick={props.handleViewCourses}
          >
            {t.viewCourse}
          </Box>
        </CardBody>
      </Card>
    </Box>
  )
}

export default MyLearing
