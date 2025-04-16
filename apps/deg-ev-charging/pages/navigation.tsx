import React, { memo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Coordinate } from '@beckn-ui/common'
import { useRouter } from 'next/router'
import { Box } from '@chakra-ui/react'

const MapWithNoSSR = dynamic(() => import('@components/Map'), { ssr: false })

const MemoizedMap = memo(
  ({
    origin,
    destination,
    startNavigation,
    showMyLocation
  }: {
    origin: Coordinate
    destination: Coordinate
    startNavigation: boolean
    showMyLocation: boolean
  }) => {
    const returnToCurrentLocation = useCallback(() => {
      console.log('returnToCurrentLocation')
    }, [])

    return (
      <MapWithNoSSR
        origin={origin}
        destination={destination}
        startNav={startNavigation}
        enableMyLocation={showMyLocation}
        setCurrentOrigin={returnToCurrentLocation}
        enableSearch={false}
      />
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.origin === nextProps.origin &&
      prevProps.destination === nextProps.destination &&
      prevProps.startNavigation === nextProps.startNavigation &&
      prevProps.showMyLocation === nextProps.showMyLocation
    )
  }
)

MemoizedMap.displayName = 'MemoizedMap'

const Navigation = () => {
  const router = useRouter()
  const { origin, destination } = router.query

  if (!origin || !destination) {
    return <></>
  }

  const originCoordinate = {
    latitude: JSON.parse(origin as string).latitude,
    longitude: JSON.parse(origin as string).longitude
  } as Coordinate
  const destinationCoordinate = {
    latitude: JSON.parse(destination as string).latitude,
    longitude: JSON.parse(destination as string).longitude
  } as Coordinate

  return (
    <>
      <Box
        position={'absolute'}
        top={'0'}
        left={'0'}
        right={'0'}
        bottom={'0'}
      >
        <MemoizedMap
          origin={originCoordinate}
          destination={destinationCoordinate}
          startNavigation={false}
          showMyLocation={false}
        />
      </Box>
    </>
  )
}

export default Navigation
