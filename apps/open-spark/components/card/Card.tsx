import { Card, CardBody } from '@chakra-ui/react'
import React from 'react'

export interface CardBoxPropsModel {
  handleOnclick?: () => void
  childComponent: () => React.ReactElement<any, any> | null
}

const CardWithCheckBox: React.FC<CardBoxPropsModel> = props => {
  const { childComponent, handleOnclick } = props

  return (
    <Card
      className="border_radius_all"
      onClick={handleOnclick}
      boxShadow={'0px 20px 25px 0px rgba(0, 0, 0, 0.1)'}
    >
      <CardBody
        padding={'20px 10px'}
        h="54px"
      >
        {childComponent()}
      </CardBody>
    </Card>
  )
}

export default React.memo(CardWithCheckBox)
