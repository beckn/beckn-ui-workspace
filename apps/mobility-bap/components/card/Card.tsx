import { Box, Card, CardBody, Text, Image, Flex } from '@chakra-ui/react'
import React from 'react'

import styles from './Card.module.css'

export interface CardWithCheckBoxPropsModel {
  paymentMethod: string
  setChecked: React.Dispatch<React.SetStateAction<boolean>>
}

const CardWithCheckBox: React.FC<CardWithCheckBoxPropsModel> = props => {
  const handleChange = () => {
    props.setChecked(prevValue => !prevValue)
  }

  return (
    <Card className="border_radius_all">
      <CardBody padding={'10px 10px'}>
        <Flex
          className={styles.checkbox}
          fontSize={'15px'}
          alignItems={'center'}
          columnGap={'12px'}
        >
          <input
            type="checkbox"
            id="checkbox"
            onChange={handleChange}
          />
          <Image
            src={'/images/cash.svg'}
            w={'62px'}
            h={'40px'}
            ml={'15px'}
          />
          <label htmlFor="checkbox">
            <Text
              position={'absolute'}
              width={'50vw'}
              marginLeft="100px"
              fontSize={'15px'}
              fontWeight={400}
            >
              {props.paymentMethod}
            </Text>
          </label>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default React.memo(CardWithCheckBox)
