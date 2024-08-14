import React, { useCallback } from 'react'
import QuarantineZoneMap from '@components/quarantineZoneMap/quarantineZoneMap'
import { useSelector } from 'react-redux'
import { PolicyDetailsRootState } from '@store/policy-slice'

const Geofence = () => {
  const polygonData = useSelector((state: PolicyDetailsRootState) => state.policy.polygonGeolocation)

  const getPolygonPaths = useCallback(() => {
    return polygonData.map(data => {
      const latLong = data.split(',')
      return { lat: parseFloat(latLong[0]), lng: parseFloat(latLong[1]) }
    })
  }, [polygonData])

  return <QuarantineZoneMap polygonPath={getPolygonPaths()} />
}

export default Geofence
