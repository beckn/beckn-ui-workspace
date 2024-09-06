import React, { useEffect, useState } from 'react'
import { Typography } from '@beckn-ui/molecules'
import { Box, Button, Flex } from '@chakra-ui/react'
import CustomButton from '@components/Button/CustomButton'
import DynamicGeofenceMap from '@components/DynamicGeofenceMap'
import { useRouter } from 'next/router'

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
          polygonPath={polygonPath}
          updateCoordinates={() => {}}
        />
      </Box>
      <Flex
        width={'100%'}
        justifyContent="center"
      >
        <CustomButton
          variant="outline"
          text="Go back"
          onClick={() => router.push('/policyDetails')}
          mr="1rem"
        />
      </Flex>
    </>
  )
}

export default ViewGeofenceDetails
