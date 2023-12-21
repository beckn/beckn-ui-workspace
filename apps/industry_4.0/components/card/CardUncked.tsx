import { Card, CardBody, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import styles from './Card.module.css'

export interface CardWithUncheckedPropsModel {
  paymentMethod: string
  paymentMethodNet: string
  img1: string
  img2: string
  setChecked: React.Dispatch<React.SetStateAction<boolean>>
}

const CardWithUnchecked: React.FC<CardWithUncheckedPropsModel> = props => {
  const handleChange = () => {
    props.setChecked(prevValue => !prevValue)
  }

  return (
    <Card className="border_radius_all">
      <CardBody padding={'15px 20px'}>
        <Flex
          pointerEvents={'none'}
          opacity={'0.5'}
          className={styles.checkbox}
          fontSize={'15px'}
          mb={'20px'}
          alignItems={'center'}
          columnGap={'20px'}
        >
          <input
            type="checkbox"
            id="checkbox_Click_Collect"
            checked={false}
            onChange={handleChange}
          />
          <Image
            src={props.img1}
            w={'62px'}
            h={'40px'}
          />
          <label htmlFor="checkbox_Click_Collect">
            <Text
              position={'absolute'}
              width={'50vw'}
              marginLeft="100px"
              fontSize={'15px'}
              fontWeight={400}
            >
              {props.paymentMethodNet}
            </Text>
          </label>
        </Flex>
        <Flex
          pointerEvents={'none'}
          opacity={'0.5'}
          className={styles.checkbox}
          fontSize={'15px'}
          mb={'20px'}
          alignItems={'center'}
          columnGap={'20px'}
        >
          <input
            type="checkbox"
            id="checkbox_Click_Collect"
            checked={false}
            onChange={handleChange}
          />
          <Image
            src={props.img2}
            w={'62px'}
            h={'40px'}
          />
          <label htmlFor="checkbox_Click_Collect">
            <Text
              position={'absolute'}
              width={'50vw'}
              marginLeft="100px"
              fontSize={'15px'}
              fontWeight={400}
            >
              {props.paymentMethodNet}
            </Text>
          </label>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default React.memo(CardWithUnchecked)
