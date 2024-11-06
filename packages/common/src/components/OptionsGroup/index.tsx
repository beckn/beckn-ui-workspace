import React, { useState, useMemo } from 'react'
import { Box, Checkbox, Text, SimpleGrid, Radio, RadioGroup } from '@chakra-ui/react'

interface DataPoint {
  label: string
  value: string
}

interface OptionsGroupProps {
  types: 'checkbox' | 'radio'
  heading?: string
  dataPoints: DataPoint[]
  handleCheckboxChange: (value: string) => void
  colorScheme?: string
}

const OptionsGroup: React.FC<OptionsGroupProps> = ({
  types,
  heading,
  dataPoints,
  handleCheckboxChange,
  colorScheme
}) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, boolean>>({})
  const [selectedRadio, setSelectedRadio] = useState<string>('')

  const onCheckboxChange = (value: string) => {
    setSelectedCheckboxes(prevSelected => ({
      ...prevSelected,
      [value]: !prevSelected[value]
    }))
    handleCheckboxChange(value)
  }

  const onRadioChange = (value: string) => {
    setSelectedRadio(value)
    handleCheckboxChange(value)
  }

  const gridCol = useMemo(() => {
    const avgLabelLength = dataPoints.reduce((acc, point) => acc + point.label.length, 0) / dataPoints.length
    return avgLabelLength > 8 ? [2, 2, 3] : [3, 3, 4, 6]
  }, [dataPoints])

  return (
    <Box>
      {heading && (
        <Text
          fontWeight="600"
          mb={4}
          fontSize={['12px', '16px']}
        >
          {heading}
        </Text>
      )}
      {types === 'checkbox' && (
        <SimpleGrid
          columns={gridCol}
          spacing={4}
        >
          {dataPoints.map(point => (
            <Checkbox
              key={point.value}
              isChecked={selectedCheckboxes[point.value] || false}
              onChange={() => onCheckboxChange(point.value)}
              colorScheme={colorScheme}
            >
              <Text
                fontSize={['12px', '16px']}
                dangerouslySetInnerHTML={{ __html: point.label }}
              ></Text>
            </Checkbox>
          ))}
        </SimpleGrid>
      )}

      {types === 'radio' && (
        <RadioGroup
          onChange={onRadioChange}
          value={selectedRadio}
        >
          <SimpleGrid
            columns={gridCol}
            spacing={4}
          >
            {dataPoints.map(point => (
              <Radio
                key={point.value}
                value={point.value}
                colorScheme={colorScheme}
              >
                <Text fontSize={['12px', '16px']}>{point.label}</Text>
              </Radio>
            ))}
          </SimpleGrid>
        </RadioGroup>
      )}
    </Box>
  )
}

export default OptionsGroup
