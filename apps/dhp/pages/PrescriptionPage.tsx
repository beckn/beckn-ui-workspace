import { Box, Text, Flex, Divider, useDisclosure } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import BottomModal from '../components/BottomModal'
import BottomModalForXrays from '../components/BottomModal/BottomModalForXrays'
import DetailsCard from '../components/detailsCard/DetailsCard'
import ViewMoreOrderModal from '../components/orderDetails/ViewMoreOrderModal'
import { useLanguage } from '../hooks/useLanguage'

const PrescriptionPage = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchForLab, setSearchForLab] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleSearchForLab = () => {
    setSearchForLab(true)
  }

  const handlePurchaseMedicines = () => {
    localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
    Router.push(`/searchMedicine?searchTerm=${searchTerm}`)
  }

  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <Box fontSize={'17px'}>{t.recommendedTests}</Box>
      <DetailsCard>
        <Text color={'rgba(var(--color-primary))'} fontSize="15px" pb={'8px'} cursor="pointer" onClick={onOpen}>
          {t.XRayscan}
        </Text>
        <Text fontSize={'12px'}>To check for fractures in your right knee</Text>
      </DetailsCard>
      <Box fontSize={'17px'}>{t.medication}</Box>
      <DetailsCard>
        <Box pb={'10px'}>
          <Flex justifyContent={'space-between'} alignItems="center">
            <Text fontSize={'15px'}>Paracetamol 650mg</Text>
            <Text fontSize={'15px'}>X 01</Text>
          </Flex>
          <Text fontSize={'12px'} pb="5px">
            1 tab x 3 times a day for 7 days
          </Text>
        </Box>
        <Box pb={'20px'}>
          <Flex justifyContent={'space-between'} alignItems="center">
            <Text fontSize={'15px'}>Zintac 150mg</Text>

            <Text fontSize={'15px'}>X 02</Text>
          </Flex>
          <Text fontSize={'12px'} pb="5px">
            1 tab after dinner for 3 days
          </Text>
        </Box>
        <Box
          fontSize={'15px'}
          color={'rgba(var(--color-primary))'}
          textAlign="center"
          cursor={'pointer'}
          onClick={handlePurchaseMedicines}
        >
          {t.purchaseMedicines}
        </Box>
      </DetailsCard>

      <BottomModalForXrays
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        items={'X-Ray'}
        description={'Would you like to search for labs providing X-Ray Service?'}
      />
    </Box>
  )
}

export default PrescriptionPage
