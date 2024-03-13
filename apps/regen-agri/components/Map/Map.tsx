import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    ZoomControl,
} from 'react-leaflet'
import { Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Control from 'react-leaflet-custom-control'
import 'leaflet/dist/leaflet.css'
import { GiHamburgerMenu } from 'react-icons/gi'
import { data } from './StoreMarkerData'
import Icon from './store-marker.svg'
import SelectedIcon from './SelectedMarker.svg'
import CenterMarker from './CenterMarker.svg'
import L from 'leaflet'
import { isEmpty } from 'lodash'
import { getUserLocation } from '../../utilities/common-utils'

interface MapProps {
    coords: { lat: number; long: number }
    handleModalOpen: () => void
    handleOptionDetailOpen: () => void
    setSelectedStore: React.Dispatch<React.SetStateAction<any>>
    selectedStore: any
    // Using any for now since exact structure is not clear
    stores: any[]
}

const Map: React.FC<MapProps> = ({
    stores,
    selectedStore,
    coords,
    handleModalOpen,
    handleOptionDetailOpen,
    setSelectedStore,
}) => {
    const { lat, long } = coords
    const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null
    )
    const [flyToUserLocation, setFlyToUserLocation] = useState(false)

    useEffect(() => {
        getUserLocation()
            .then((position) => {
                setUserLocation([
                    position.coords.latitude,
                    position.coords.longitude,
                ])
            })
            .catch((error) => {
                console.error(`Error getting user location: ${error.message}`)
            })
    }, [])

    // Custom hook to zoom the map to the user's location
    const ZoomToUserLocation = () => {
        let map = useMap()

        if (userLocation && flyToUserLocation) {
            map.flyTo(userLocation, 12)
        }

        return null
    }

    const customIcon = new L.Icon({
        iconUrl: Icon,
        iconSize: [25, 35],
        iconAnchor: [5, 30],
    })

    const customCenterMarker = new L.Icon({
        iconUrl: CenterMarker,
        iconSize: [40, 50],
        iconAnchor: [5, 30],
    })

    const customSelectedIcon = new L.Icon({
        iconUrl: Icon,
        iconSize: [35, 45],
        iconAnchor: [5, 30],
    })

    function MapView() {
        let map = useMap()
        map.setView([lat, long], map.getZoom())
        return null
    }

    return (
        <MapContainer
            style={{ maxHeight: '100vh', height: '90vh' }}
            center={[lat, long]}
            zoom={16}
            zoomControl={false}
            scrollWheelZoom={true}
            zoomAnimation={true}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
        contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Control
                prepend
                position="topright"
            >
                <div className="flex flex-col basis-4">
                    <Image
                        className="translate-x-0.5"
                        onClick={() => setFlyToUserLocation(true)}
                        src="/images/LocateMe.svg"
                        alt="..."
                    />
                </div>
            </Control>

            {!isEmpty(stores) &&
                stores.map((item: any, index: number) => {
                    const isSelected =
                        item.lat === selectedStore?.lat &&
                        item.lon === selectedStore?.lon
                    const IconToUse = isSelected
                        ? customSelectedIcon
                        : customIcon
                    return (
                        <Marker
                            icon={IconToUse}
                            key={item.lon}
                            position={[item.lat, item.lon]}
                            eventHandlers={{
                                click: () => {
                                    setSelectedStore(item)
                                    handleOptionDetailOpen()
                                },
                            }}
                        ></Marker>
                    )
                })}
            <Marker
                icon={customCenterMarker}
                position={[lat, long]}
            ></Marker>
            <ZoomControl position="topright" />

            <MapView />
            <ZoomToUserLocation />
        </MapContainer>
    )
}

// React memo not working for some reason
//TODO Needed because the map is re-rendered even if the co-ords are same causing a flickering issue on the map. Will fix this later
export default React.memo(Map, (prevProps, nextProps) => {
    if (
        prevProps.coords.lat === nextProps.coords.lat &&
        prevProps.coords.long === nextProps.coords.long
    ) {
        return true
    }
    return false
})
