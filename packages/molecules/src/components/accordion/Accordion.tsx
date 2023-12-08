import React from 'react'
import {
  Accordion as AccordionComp,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody
} from '@chakra-ui/react'
import { AccordionProps } from './accordion.types'

const Accordion: React.FC<AccordionProps> = props => {
  const { accordionHeader, children, onToggle, className = '' } = props
  return (
    <Card>
      <AccordionComp
        onChange={onToggle}
        allowMultiple
        className={`${className}-accordion-container`}
      >
        <AccordionItem
          background={'unset'}
          border={'unset'}
          boxShadow={'0px 8px 10px -6px rgb(0 0 0 / 10%), 0px 20px 25px -5px rgb(0 0 0 / 10%)'}
        >
          <CardBody padding={'15px 20px'}>
            <AccordionButton
              padding={'unset'}
              background={'unset !important'}
            >
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontSize={'17px'}
                fontWeight={'600'}
                className={`${className}-accordion-header-text`}
              >
                {accordionHeader}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </CardBody>
          <AccordionPanel
            className={`${className}-accordion-content`}
            padding={'unset'}
          >
            {children}
          </AccordionPanel>
        </AccordionItem>
      </AccordionComp>
    </Card>
  )
}

export default Accordion
