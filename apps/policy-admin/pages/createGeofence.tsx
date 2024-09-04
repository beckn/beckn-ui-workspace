import { Typography } from '@beckn-ui/molecules'
import { Box, Button, Flex } from '@chakra-ui/react'
import CustomButton from '@components/Button/CustomButton'
import DynamicGeofenceMap from '@components/DynamicGeofenceMap'
import { GeoCoordinate } from '@lib/types/geofence'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const CreateGeofence = () => {
  const [polygonPath, setPolygonPath] = useState<GeoCoordinate[]>([])
  const [coordinatesForForm, setCoordinatesForForm] = useState<string[]>([])

  const router = useRouter()

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng?.lat()!
      const lng = event.latLng?.lng()!
      const newPoint: GeoCoordinate = { lat, lng }
      setPolygonPath(prev => [...prev, newPoint])
      setCoordinatesForForm(prev => [...prev, `${lat},${lng}`])
    }
  }
  console.log(polygonPath, coordinatesForForm)
  const handleClearPolygon = () => {
    setPolygonPath([])
    setCoordinatesForForm([])
    // policyFormDataAndActions.updatePolygon([]);
  }

  const handleSaveCoordinates = () => {
    // policyFormDataAndActions.updatePolygon(coordinatesForForm);
    router.push('/createPolicy')
  }
  const updateCoordinates = (path: GeoCoordinate[]) => {
    setPolygonPath(path)
    setCoordinatesForForm(path.map(point => `${point.lat},${point.lng}`))
  }
  return (
    <>
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
          handleMapClick={handleMapClick}
        />
      </Box>
      <Flex width={'31rem'}>
        <CustomButton
          variant="outline"
          text="Go back"
          onClick={() => router.push('/createPolicy')}
          mr="1rem"
        />
        <CustomButton
          variant="solid"
          bgGradient="linear(180deg, #000428 0%, #004e92 100%) !important"
          text="Save"
          _hover={{ opacity: 0.9 }}
          onClick={handleSaveCoordinates}
        />
      </Flex>
    </>
  )
}

export default CreateGeofence
