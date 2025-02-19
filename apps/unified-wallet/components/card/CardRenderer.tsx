import { Card, CardBody } from '@chakra-ui/react'
import React from 'react'

export interface CardBoxPropsModel {
  handleOnclick?: () => void
  childComponent: () => React.ReactElement<any, any> | null
  styles?: React.CSSProperties
}

const CardRenderer: React.FC<CardBoxPropsModel> = props => {
  const { childComponent, handleOnclick, styles } = props

  return (
    <Card
      className="border_radius_all"
      onClick={handleOnclick}
      margin="10px"
      boxShadow={'0px 10px 14px 0px #0000001A'}
      style={styles}
    >
      <CardBody
        padding={'0px 5px'}
        h="54px"
      >
        {childComponent()}
      </CardBody>
    </Card>
  )
}

export default React.memo(CardRenderer)
