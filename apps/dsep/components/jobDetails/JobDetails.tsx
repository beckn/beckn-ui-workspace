import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import Styles from './JobDetails.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../../components/button/Button'

interface ResponseProps {
  jobTitle: string
  companyName: string
  jobDesc: string
  requirements: string
  qualifications: string
  jobType: string
}

interface JobDetailsProps {
  response: ResponseProps
}

const { t } = useLanguage()

const JobDetails = (props: JobDetailsProps) => {
  return (
    <Box className={Styles.mainContainer}>
      <Flex className={Styles.flexContainer}>
        <Box className={Styles.headingContainer}>
          <Text fontWeight={600} fontSize={'17px'}>
            {props.response.jobTitle}
          </Text>
          <Text>{props.response.companyName}</Text>
        </Box>
        <Box className={Styles.boxContainer}>
          <Box>
            <Text paddingBottom={'7px'} fontWeight={'bold'} fontSize={'12px'}>
              {t.jobDesc}
            </Text>
            <Text fontSize={'12px'}>{props.response.jobDesc}</Text>
          </Box>
          <Box className={Styles.reqContainer}>
            <Text paddingBottom={'7px'} fontWeight={'bold'} paddingTop={'12px'} fontSize={'12px'}>
              {t.requirements}
            </Text>
            <Text fontSize={'12px'}>{props.response.requirements}</Text>
          </Box>
          <Box className={Styles.qualContainer}>
            <Text fontWeight={'bold'}>{t.qualifications} </Text>
            <Text>{props.response.qualifications}</Text>
          </Box>
          <Box className={Styles.qualContainer}>
            <Text fontWeight={'bold'}>{t.jobType}</Text>
            <Text>{props.response.jobType}</Text>
            <Text marginTop={'15px'}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
          </Box>
        </Box>

        <Box className={Styles.buttonContainer}>
          <Button
            buttonText={t.applyNow}
            color={'rgba(var(--text-color))'}
            background={'rgba(var(--color-primary))'}
            isDisabled={false}
            handleOnClick={() => {}}
          ></Button>
        </Box>
      </Flex>
    </Box>
  )
}

export default JobDetails
