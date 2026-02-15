import { Card, CardBody, Text, Image, Flex } from '@chakra-ui/react'
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
      <CardBody
        padding={'20px 10px'}
        h="54px"
      >
        <Flex
          className={styles.checkbox}
          fontSize={'15px'}
          alignItems={'center'}
          columnGap={'14px'}
        >
          <input
            type="checkbox"
            id="checkbox"
            onChange={handleChange}
          />
          <label htmlFor="checkbox">
            <Text
              position={'absolute'}
              width={'50vw'}
              marginLeft="32px"
              fontSize={'15px'}
              fontWeight={400}
            >
              <Flex alignItems={'center'}>
                <Image
                  src={'/images/cash.svg'}
                  w={'62px'}
                  h={'40px'}
                  mr={'12px'}
                />
                {'Cash'}
              </Flex>
            </Text>
          </label>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default React.memo(CardWithCheckBox)
