import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { FiFilter, FiGrid, FiList } from 'react-icons/fi'
import Filter from '@beckn-ui/common/src/components/filter'

interface FilterControlsProps {
  title: string
  viewMode: 'grid' | 'list'
  showFilter: boolean
  onViewModeChange: (mode: 'grid' | 'list') => void
  onToggleFilter: () => void
  onApplyFilter: (filterData: Record<string, string>) => void
  onResetFilter: () => void
}

const FilterControls: React.FC<FilterControlsProps> = ({
  title,
  viewMode,
  showFilter,
  onViewModeChange,
  onToggleFilter,
  onApplyFilter,
  onResetFilter
}) => {
  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        mb="24px"
        flexWrap="wrap"
        gap={{ base: '12px', md: '16px' }}
      >
        <Text
          fontSize={{ base: '20px', md: '24px' }}
          fontWeight="700"
          color="gray.800"
        >
          {title}
        </Text>
        <Flex
          align="center"
          gap="8px"
        >
          {/* Filter Button */}
          <Flex
            as="button"
            align="center"
            gap="6px"
            border="1px solid"
            borderColor="gray.300"
            onClick={onToggleFilter}
            bg={showFilter ? '#FF6B35' : 'white'}
            color={showFilter ? 'white' : 'gray.700'}
            h="38px"
            px="14px"
            borderRadius="19px"
            fontWeight="500"
            fontSize="14px"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              bg: showFilter ? '#E55A2B' : 'gray.50',
              borderColor: '#FF6B35'
            }}
          >
            <FiFilter size="14px" />
            <Text>Filter</Text>
          </Flex>

          {/* View Mode Toggle */}
          <Flex
            border="1px solid"
            borderColor="gray.300"
            borderRadius="19px"
            overflow="hidden"
            bg="white"
            h="38px"
            align="center"
          >
            <Box
              as="button"
              px="12px"
              h="100%"
              bg={viewMode === 'grid' ? '#FF6B35' : 'white'}
              color={viewMode === 'grid' ? 'white' : 'gray.500'}
              onClick={() => onViewModeChange('grid')}
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all 0.2s"
              _hover={{ bg: viewMode === 'grid' ? '#E55A2B' : 'gray.50' }}
            >
              <FiGrid size="16px" />
            </Box>
            <Box
              as="button"
              px="12px"
              h="100%"
              bg={viewMode === 'list' ? '#FF6B35' : 'white'}
              color={viewMode === 'list' ? 'white' : 'gray.500'}
              onClick={() => onViewModeChange('list')}
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all 0.2s"
              _hover={{ bg: viewMode === 'list' ? '#E55A2B' : 'gray.50' }}
            >
              <FiList size="16px" />
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {/* Filter Panel */}
      {showFilter && (
        <Box
          mb="24px"
          bg="white"
          borderRadius="12px"
          p="20px"
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
        >
          <Filter
            handleApplyFilter={onApplyFilter}
            handleResetFilter={onResetFilter}
            handleCancelFilter={onToggleFilter}
          />
        </Box>
      )}
    </>
  )
}

export default FilterControls
