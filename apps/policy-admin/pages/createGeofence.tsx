import { Typography } from '@beckn-ui/molecules'
import { Box, Button, Flex } from '@chakra-ui/react'
import CustomButton from '@components/Button/CustomButton'
import DynamicGeofenceMap from '@components/DynamicGeofenceMap'
import { GeoCoordinate } from '@lib/types/geofence'
import { PolicyRootState, updatePolygon } from '@store/policy.slice'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const CreateGeofence = () => {
  const [polygonPath, setPolygonPath] = useState<GeoCoordinate[]>([])
  const [coordinatesForForm, setCoordinatesForForm] = useState<string[]>([])

  const router = useRouter()
  const dispatch = useDispatch()

  const handleClearPolygon = () => {
    setPolygonPath([])
    setCoordinatesForForm([])
    dispatch(updatePolygon([]))
  }

  const handleSaveCoordinates = () => {
    dispatch(updatePolygon(coordinatesForForm))
    router.push('/createPolicy')
  }

  const updateCoordinates = (path: GeoCoordinate[]) => {
    setPolygonPath(path)
    setCoordinatesForForm(path.map(point => `${point.lat}, ${point.lng}`))
  }

  return (
    <Box
      maxH={'calc(100vh - 110px)'}
      overflowY="auto"
      overflowX="hidden"
      className="hideScroll"
    >
      <Flex
        justifyContent={'space-between'}
        mb="2rem"
      >
        <Typography text="* Please draw a polygon to create a Geofence" />
        <Typography
          text="Clear Geofence"
          color="#013067"
          fontWeight="400"
          style={{ cursor: 'pointer' }}
          onClick={handleClearPolygon}
        />
      </Flex>
      <Box
        border="1px solid #72767e"
        mb="2rem"
        maxH={'calc(100vh - 250px)'}
        h="650px"
      >
        <DynamicGeofenceMap
          polygonPath={polygonPath}
          updateCoordinates={updateCoordinates}
        />
      </Box>
      <Flex
        width={{ base: '100%', md: '31rem' }}
        display={{ base: 'block', md: 'flex' }}
      >
        <CustomButton
          variant="outline"
          text="Go back"
          onClick={() => router.push('/createPolicy')}
          mr="1rem"
          w={{ base: '100%', md: 'unset' }}
        />
        <CustomButton
          variant="solid"
          bgGradient="linear(180deg, #000428 0%, #004e92 100%) !important"
          text="Save"
          _hover={{ opacity: 0.9 }}
          onClick={handleSaveCoordinates}
          w={{ base: '100%', md: 'unset' }}
        />
      </Flex>
    </Box>
  )
}

export default CreateGeofence
