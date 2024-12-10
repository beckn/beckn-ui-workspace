import { Box, CardBody, Text } from '@chakra-ui/react'
import React from 'react'

import styles from './CheckBoxInput.module.css'
import { CheckBoxInputProps } from './CancelFlow'

const CheckBoxInput: React.FC<CheckBoxInputProps> = ({ cancellationReason, checked, onChange, id }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target

    onChange(name)
  }

  return (
    <CardBody padding={'10px'}>
      <Box
        className={styles.checkbox}
        fontSize={'15px'}
        data-test={'checkbox-group'}
      >
        <input
          name={typeof id === 'number' ? id.toString() : id}
          type="checkbox"
          id={`checkbox-${id}`}
          onChange={handleChange}
          checked={checked}
          data-test={`checkbox-${id}`}
        />
        <label htmlFor={`checkbox-${id}`}>
          <Text
            position={'absolute'}
            width={'50vw'}
            marginLeft="40px"
          >
            {cancellationReason}
          </Text>
        </label>
      </Box>
    </CardBody>
  )
}

export default React.memo(CheckBoxInput)
