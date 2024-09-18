import React, { useEffect, useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import CustomButton from '@components/Button/CustomButton'
import DynamicGeofenceMap from '@components/DynamicGeofenceMap'
import { useRouter } from 'next/router'
import { calculateCenterOfPolygon } from '@utils/geoLocation'

const ViewGeofenceDetails = () => {
  const [polygonPath, setPolygonPath] = useState([])

  const router = useRouter()

  useEffect(() => {
    console.log(router.query)
    if (router.query.coords) {
      const coords = JSON.parse(router.query.coords as string)
      setPolygonPath(coords)
    }
  }, [])

  return (
    <>
      <Box
        border="1px solid #72767e"
        mb="2rem"
        maxH={'calc(100vh - 250px)'}
        h="650px"
      >
        <DynamicGeofenceMap
          enableSearch={false}
          editable={false}
          focusedPosition={calculateCenterOfPolygon(polygonPath)!}
          polygonPath={polygonPath}
          updateCoordinates={() => {}}
        />
      </Box>
      <Flex
        width={{ base: '100%', md: '100%' }}
        display={{ base: 'block', md: 'flex' }}
        justifyContent="center"
      >
        <CustomButton
          variant="outline"
          text="Go back"
          onClick={() => router.back()}
          w={{ base: '100%', md: '15rem' }}
        />
      </Flex>
    </>
  )
}

export default ViewGeofenceDetails
