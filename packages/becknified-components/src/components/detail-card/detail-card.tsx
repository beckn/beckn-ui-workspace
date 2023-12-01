import React from 'react'
import { Card, CardBody, Text } from '@chakra-ui/react'

interface DetailsCardProps {
  children: React.ReactNode
  className?: string
}

const DetailCard: React.ForwardRefRenderFunction<HTMLDivElement, DetailsCardProps> = (props, ref) => {
  const { className, children } = props
  return (
    <>
      <Card
        ref={ref}
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
