import React from 'react'
import { Card, CardBody, Text } from '@chakra-ui/react'

export interface DetailsCardProps {
  children: React.ReactNode
  className?: string
}

const DetailCard: React.FC<DetailsCardProps> = props => {
  const { className, children } = props
  return (
    <>
      <Card
        className={`${className} card_container`}
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
      >
        <CardBody
          className={`${className} card_body`}
          padding={'15px 20px'}
        >
          {children}
        </CardBody>
      </Card>
    </>
  )
}

export default DetailCard
