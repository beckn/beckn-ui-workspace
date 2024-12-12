import React, { useState, useEffect } from 'react'
import { Box, VStack, IconButton, Container, Flex } from '@chakra-ui/react'
import { BiPlusCircle } from 'react-icons/bi'
import { CiCircleMinus } from 'react-icons/ci'
import { Typography } from '@beckn-ui/molecules'
import AddNewDerModal from './AddNewDerModal'
import DeleteAlertModal from '../modal/DeleteAlertModal'
import axios from 'axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { useSelector } from 'react-redux'
import { RootState } from '@store/index'
import Cookies from 'js-cookie'

interface Device {
  id: number
  name: string
  paired?: boolean
}

interface DeviceListProps {
  initialDevices: Device[]
  initialNearbyDevices?: Device[]
  onDeviceChange: (devices: Device[]) => void
  fetchPairedData: () => void
}

export default function DeviceList({ initialDevices, onDeviceChange, fetchPairedData }: DeviceListProps) {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const { role } = useSelector((state: RootState) => state.auth)
  const bearerToken = Cookies.get('authToken')

  const handleAddDevice = async (category: string, uploadedFiles: File[]) => {
    setIsLoading(true)
    try {
      const type = role === ROLE.PRODUCER ? 'prosumer' : 'consumer'
      const formData = new FormData()

      formData.append('type', type)
      formData.append('category', category)
      uploadedFiles.forEach(file => {
        formData.append('proof', file)
      })

      const response = await axios.post(`${strapiUrl}${ROUTE_TYPE[role!]}/der`, formData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        },
        withCredentials: true
      })
      if (response.status === 200 || response.status === 204) {
        fetchPairedData()
        setIsModalOpen(false)
      }
    } catch (error: any) {
      console.error('Error adding device:', error?.message)
    } finally {
      setIsLoading(false)
      handleModalClose()
    }
  }

  const handleModalOpen = () => setIsModalOpen(true)
  const handleModalClose = () => setIsModalOpen(false)

  const handleDeleteModalOpen = (index: number) => {
    setSelectedDeviceIndex(index)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setSelectedDeviceIndex(null)
    setIsDeleteModalOpen(false)
  }

  const handleRemoveDevice = async (index: number) => {
    try {
      const response = await axios.delete(`${strapiUrl}${ROUTE_TYPE[role!]}/der/${index}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      if (response.status === 200 || response.status === 204) {
        fetchPairedData()
      } else {
        console.error('Failed to delete the device:', response.data)
      }
    } catch (error: any) {
      console.error('Error deleting device:', error?.message)
    } finally {
      handleDeleteModalClose()
    }
  }

  const handleConfirmDeleteDevice = () => {
    if (selectedDeviceIndex !== null) {
      handleRemoveDevice(selectedDeviceIndex)
      handleDeleteModalClose()
    }
  }

  useEffect(() => {
    setDevices(initialDevices)
    onDeviceChange(initialDevices)
  }, [initialDevices, onDeviceChange])

  return (
    <Container>
      <Box>
        <VStack
          align="stretch"
          spacing={4}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              text="Pair Device"
              fontWeight="600"
              fontSize="15px"
            />
            <IconButton
              aria-label="Add device"
              icon={<BiPlusCircle size={20} />}
              variant="ghost"
              onClick={handleModalOpen}
            />
          </Flex>

          <Typography
            text="Paired"
            fontWeight="600"
            fontSize="12px"
          />

          <VStack
            spacing={4}
            align="stretch"
          >
            {devices.map((device, index) => (
              <Flex
                key={index}
                p={3}
                borderWidth="1px"
                borderRadius="12px"
                justify="space-between"
                alignItems="center"
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
              >
                <Typography text={device?.name} />
                <CiCircleMinus
                  onClick={() => handleDeleteModalOpen(device?.id)}
                  style={{ cursor: 'pointer' }}
                  size={24}
                  opacity="0.5"
                />
              </Flex>
            ))}
          </VStack>
        </VStack>
      </Box>

      <AddNewDerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAddDevice}
        isLoading={isLoading}
      />
      <DeleteAlertModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        handleConfirmDeleteDevice={handleConfirmDeleteDevice}
        isLoading={isDeleteLoading}
      />
    </Container>
  )
}
