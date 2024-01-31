import React from 'react'
import { Accordion, Typography } from '@beckn-ui/molecules'
import { CardBody, Flex } from '@chakra-ui/react'
import { AccordionDetailCardProps } from './accordion-detail-card.types'

const AccordionDetailCard: React.FC<AccordionDetailCardProps> = ({ schema: { accordion, dataSource }, children }) => {
  const renderChildrenOrDataSource = () => {
    if (children) {
      return children
    }

    if (dataSource) {
      const { source, className = '' } = dataSource
      return Object.entries(source).map(([key, value], idx) => (
        <Flex
          key={idx}
          mt={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            className={`${className}_key`}
            text={key}
          />
          <Typography
            className={`${className}_value`}
            text={value}
          />
        </Flex>
      ))
    }
    return <></>
  }

  return (
    <Accordion {...accordion}>
      <CardBody
        pt="unset"
        fontSize="15px"
      >
        {renderChildrenOrDataSource()}
      </CardBody>
    </Accordion>
  )
}

export default React.memo(AccordionDetailCard)
