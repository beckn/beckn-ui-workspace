import React, { useState, useEffect, useMemo } from 'react'
import { Box, Checkbox, Text, SimpleGrid, Radio, RadioGroup, SystemStyleObject } from '@chakra-ui/react'

export interface DataPoint {
  label: string
  value: string
}

interface OptionsGroupProps {
  types: 'checkbox' | 'radio' | string
  heading?: string
  dataPoints: DataPoint[]
  handleSelectionChange: (selectedValues: DataPoint[]) => void
  multiSelect?: boolean
  colorScheme?: string
  sx?: SystemStyleObject
}

const OptionsGroup: React.FC<OptionsGroupProps> = ({
  types,
  heading,
  dataPoints,
  handleSelectionChange,
  multiSelect = false,
  colorScheme,
  sx
}) => {
  const [selectedValues, setSelectedValues] = useState<DataPoint[]>([])

  const gridCol = useMemo(() => {
    const avgLabelLength = dataPoints.reduce((acc, point) => acc + point.label.length, 0) / dataPoints.length
    return avgLabelLength > 8 ? [2, 2, 3] : [3, 3, 4, 6]
  }, [dataPoints])

  useEffect(() => {
    handleSelectionChange(selectedValues)
  }, [selectedValues, handleSelectionChange])

  const onCheckboxChange = (dataPoint: DataPoint) => {
    setSelectedValues(prevSelected => {
      const isSelected = prevSelected.find(item => item.value === dataPoint.value)
      if (isSelected) {
        return prevSelected.filter(item => item.value !== dataPoint.value)
      } else {
        return [...prevSelected, dataPoint]
      }
    })
  }

  const onRadioChange = (value: string) => {
    const selectedDataPoint = dataPoints.find(dp => dp.value === value)
    if (selectedDataPoint) {
      setSelectedValues([selectedDataPoint])
    }
  }

  return (
    <Box
      sx={sx}
      key={Math.random().toFixed(1)}
    >
      {heading && (
        <Text
          fontWeight="600"
          mb={4}
          fontSize={['12px', '16px']}
          data-test="product-details-checkbox-section-title"
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
              isChecked={selectedValues.some(selected => selected.value === point.value)}
              onChange={() => onCheckboxChange(point)}
              colorScheme={colorScheme}
              data-test="product-checkbox"
            >
              <Text
                fontSize={['12px', '16px']}
                dangerouslySetInnerHTML={{ __html: point.label }}
                data-test="product-checkbox-text"
              />
            </Checkbox>
          ))}
        </SimpleGrid>
      )}

      {types === 'radio' && (
        <RadioGroup
          onChange={onRadioChange}
          value={selectedValues[0]?.value || ''}
        >
          <SimpleGrid
            columns={gridCol}
            spacing={4}
          >
            {dataPoints.map(point => (
              <Radio
                key={point.value}
                value={point.value}
                colorScheme={'#fff'}
                data-test="product-radio"
              >
                <Text
                  fontSize={['12px', '16px']}
                  dangerouslySetInnerHTML={{ __html: point.label }}
                  data-test="product-radio-text"
                />
              </Radio>
            ))}
          </SimpleGrid>
        </RadioGroup>
      )}
    </Box>
  )
}

export default OptionsGroup
