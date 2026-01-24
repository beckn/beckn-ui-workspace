import React, { useState, useEffect, useRef } from 'react'
import { Box, Flex, Text, Button, VStack, HStack, Collapse, Divider, Badge } from '@chakra-ui/react'
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi'

interface FilterOption {
  value: string
  label: string
}

interface FilterField {
  name: string
  label: string
  options: FilterOption[]
  defaultValue?: string
}

interface SearchFiltersProps {
  fields: FilterField[]
  onApplyFilter: (filters: Record<string, string>) => void
  onResetFilter: () => void
}

// Custom Dropdown Component
interface CustomDropdownProps {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find(opt => opt.value === value) || options[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    onClose()
  }

  return (
    <Box
      ref={dropdownRef}
      position="relative"
      zIndex={isOpen ? 10000 : 'auto'}
    >
      <Text
        fontSize="13px"
        fontWeight="600"
        color="gray.700"
        mb="4px"
      >
        {label}
      </Text>
      <Button
        w="100%"
        justifyContent="space-between"
        bg="white"
        border="1px solid"
        borderColor={isOpen ? '#FF6B35' : 'gray.300'}
        borderRadius="8px"
        fontSize="13px"
        fontWeight="400"
        h="6px"
        px="10px"
        onClick={onToggle}
        _hover={{
          borderColor: '#FF6B35'
        }}
        _focus={{
          borderColor: '#FF6B35',
          boxShadow: '0 0 0 1px #FF6B35'
        }}
      >
        <Text
          color={selectedOption?.value === '' ? 'gray.400' : 'gray.700'}
          fontSize="13px"
        >
          {selectedOption?.label || 'Select'}
        </Text>
        {isOpen ? <FiChevronUp size="14px" /> : <FiChevronDown size="14px" />}
      </Button>
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          zIndex={10000}
          mt="2px"
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="8px"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          maxH="180px"
          overflowY="auto"
          overflowX="hidden"
          w="100%"
        >
          {options.map(option => {
            const isSelected = option.value === value
            return (
              <Box
                key={option.value}
                as="button"
                w="100%"
                px="10px"
                py="8px"
                textAlign="left"
                bg={isSelected ? '#FFF5F0' : 'white'}
                color={isSelected ? '#FF6B35' : 'gray.700'}
                fontWeight={isSelected ? '600' : '400'}
                fontSize="13px"
                onClick={() => handleSelect(option.value)}
                _hover={{
                  bg: isSelected ? '#FFF5F0' : 'gray.50'
                }}
                borderBottom={option.value !== options[options.length - 1].value ? '1px solid' : 'none'}
                borderColor="gray.100"
              >
                <Flex
                  align="center"
                  justify="space-between"
                  gap="8px"
                >
                  <Text
                    fontSize="13px"
                    noOfLines={1}
                    flex="1"
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Box flexShrink={0}>
                      <FiCheck
                        size="14px"
                        color="#FF6B35"
                      />
                    </Box>
                  )}
                </Flex>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ fields, onApplyFilter, onResetFilter }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, string> = {}
    fields.forEach(field => {
      if (field.defaultValue) {
        initialData[field.name] = field.defaultValue
      }
    })
    setFormData(initialData)
    updateActiveFiltersCount(initialData)
  }, [fields])

  const updateActiveFiltersCount = (data: Record<string, string>) => {
    let count = 0
    fields.forEach(field => {
      const value = data[field.name]
      if (value && value !== '' && value !== 'all' && value !== field.defaultValue) {
        count++
      }
    })
    setActiveFiltersCount(count)
  }

  const handleChange = (name: string, value: string) => {
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    updateActiveFiltersCount(newData)
  }

  const handleApply = () => {
    onApplyFilter(formData)
    setIsOpen(false)
    setOpenDropdown(null)
  }

  const handleReset = () => {
    const resetData: Record<string, string> = {}
    fields.forEach(field => {
      if (field.defaultValue) {
        resetData[field.name] = field.defaultValue
      } else {
        resetData[field.name] = ''
      }
    })
    setFormData(resetData)
    updateActiveFiltersCount(resetData)
    onResetFilter()
  }

  const getFilterLabel = (fieldName: string, value: string): string => {
    const field = fields.find(f => f.name === fieldName)
    if (!field) return ''
    const option = field.options.find(opt => opt.value === value)
    return option?.label || ''
  }

  // Quick filter chips for common filters
  const quickFilters = [
    { name: 'dietType', value: 'veg', label: 'Vegetarian' },
    { name: 'dietType', value: 'nonveg', label: 'Non-Veg' },
    { name: 'rating', value: '4', label: '4+ Rating' }
  ]

  const handleQuickFilter = (filterName: string, filterValue: string) => {
    const field = fields.find(f => f.name === filterName)
    const defaultValue = field?.defaultValue || ''
    const currentValue = formData[filterName] || defaultValue
    const newValue = currentValue === filterValue ? defaultValue : filterValue
    handleChange(filterName, newValue)
    // Auto-apply quick filters
    const newData = { ...formData, [filterName]: newValue }
    onApplyFilter(newData)
  }

  return (
    <Box
      mb="12px"
      position="relative"
      zIndex={1}
    >
      {/* Filter Header with Quick Filters */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap="8px"
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
        mb="10px"
      >
        {/* Filter Toggle Button */}
        <Button
          leftIcon={<FiFilter size="16px" />}
          rightIcon={isOpen ? <FiChevronUp size="16px" /> : <FiChevronDown size="16px" />}
          onClick={() => setIsOpen(!isOpen)}
          bg={isOpen ? '#FF6B35' : 'white'}
          color={isOpen ? 'white' : 'gray.700'}
          border="1px solid"
          borderColor={isOpen ? '#FF6B35' : 'gray.300'}
          borderRadius="8px"
          h="34px"
          px="14px"
          fontSize="14px"
          fontWeight="500"
          _hover={{
            bg: isOpen ? '#E55A2B' : 'gray.50',
            borderColor: '#FF6B35'
          }}
        >
          All Filters
          {activeFiltersCount > 0 && (
            <Badge
              ml="8px"
              bg={isOpen ? 'white' : '#FF6B35'}
              color={isOpen ? '#FF6B35' : 'white'}
              borderRadius="full"
              px="6px"
              py="2px"
              fontSize="11px"
              fontWeight="600"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </Flex>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <Flex
          gap="6px"
          flexWrap="wrap"
          mb="8px"
        >
          {Object.entries(formData).map(([key, value]) => {
            const field = fields.find(f => f.name === key)
            if (!field) return null
            const defaultValue = field.defaultValue || ''
            // Don't show if it's empty, default value, or 'all'
            if (!value || value === '' || value === defaultValue || value === 'all') return null
            const label = getFilterLabel(key, value)
            if (!label) return null

            return (
              <HStack
                key={key}
                bg="#FFF5F0"
                border="1px solid"
                borderColor="#FF6B35"
                borderRadius="full"
                px="10px"
                py="3px"
                spacing="4px"
              >
                <Text
                  fontSize="12px"
                  color="#FF6B35"
                  fontWeight="500"
                >
                  {field.label}: {label}
                </Text>
                <Box
                  as="button"
                  onClick={() => {
                    const defaultValue = field.defaultValue || ''
                    const newData = { ...formData, [key]: defaultValue }
                    setFormData(newData)
                    updateActiveFiltersCount(newData)
                    onApplyFilter(newData)
                  }}
                  color="#FF6B35"
                  _hover={{ color: '#E55A2B' }}
                >
                  <FiX size="14px" />
                </Box>
              </HStack>
            )
          })}
        </Flex>
      )}

      {/* Collapsible Filter Panel */}
      <Collapse in={isOpen}>
        <Box
          bg="white"
          borderRadius="12px"
          p="50px"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
          border="1px solid"
          borderColor="gray.200"
          position="relative"
          overflow="visible"
        >
          <Flex
            justify="space-between"
            align="center"
            mb="12px"
          >
            <Text
              fontSize="18px"
              fontWeight="700"
              color="gray.800"
            >
              Filter Options
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              color="gray.600"
              fontSize="14px"
              fontWeight="500"
              _hover={{ color: '#FF6B35', bg: 'gray.50' }}
            >
              Reset All
            </Button>
          </Flex>

          <Divider mb="12px" />

          <VStack
            spacing="10px"
            align="stretch"
          >
            {fields.map(field => (
              <CustomDropdown
                key={field.name}
                label={field.label}
                value={formData[field.name] || field.defaultValue || ''}
                options={field.options}
                onChange={value => handleChange(field.name, value)}
                isOpen={openDropdown === field.name}
                onToggle={() => setOpenDropdown(openDropdown === field.name ? null : field.name)}
                onClose={() => setOpenDropdown(null)}
              />
            ))}
          </VStack>

          <Divider my="12px" />

          <Flex
            gap="8px"
            justify="flex-end"
          >
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                setOpenDropdown(null)
              }}
              borderColor="gray.300"
              color="gray.700"
              _hover={{ borderColor: '#FF6B35', color: '#FF6B35' }}
            >
              Cancel
            </Button>
            <Button
              bg="#FF6B35"
              color="white"
              onClick={handleApply}
              _hover={{ bg: '#E55A2B' }}
            >
              Apply Filters
            </Button>
          </Flex>
        </Box>
      </Collapse>
    </Box>
  )
}

export default SearchFilters
