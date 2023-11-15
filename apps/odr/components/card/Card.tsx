import { Box, Card, CardBody, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

import styles from './Card.module.css'

export interface CardWithCheckBoxPropsModel {
  paymentMethod: string
  setChecked: React.Dispatch<React.SetStateAction<boolean>>
}

const CardWithCheckBox: React.FC<CardWithCheckBoxPropsModel> = props => {
  const { t } = useLanguage()

  const handleChange = () => {
    props.setChecked(prevValue => !prevValue)
  }

  return (
    <Card className="border_radius_all">
      <CardBody padding={'15px 20px'}>
        <Box
          className={styles.checkbox}
          // mb={'15px'}
          fontSize={'15px'}
        >
          <input type="checkbox" id="checkbox" onChange={handleChange} />
          <label htmlFor="checkbox">
            <Text mt={'-3px'} position={'absolute'} width={'50vw'} marginLeft="40px">
              {props.paymentMethod}
            </Text>
          </label>
        </Box>
        {/* <Box
                    pointerEvents={'none'}
                    opacity={'0.5'}
                    className={styles.checkbox}
                    fontSize={'15px'}
                >
                    <input
                        type="checkbox"
                        id="checkbox_Click_Collect"
                        // disabled={true}
                        checked={false}
                        onChange={handleChange}
                    />
                    <label htmlFor="checkbox_Click_Collect">
                        <Text
                            mt={'-3px'}
                            position={'absolute'}
                            width={'50vw'}
                            marginLeft="40px"
                        >
                            {t.clickAndCollect}
                        </Text>
                    </label>
                </Box> */}
      </CardBody>
    </Card>
  )
}

export default React.memo(CardWithCheckBox)
