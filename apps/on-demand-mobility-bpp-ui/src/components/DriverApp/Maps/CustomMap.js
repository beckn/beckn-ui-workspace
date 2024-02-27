import React, { useState, useEffect, useRef } from "react";
//import { usePosition } from "../hooks/usePosition";
import { CarIcon } from "../../../shared/icons/Car";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const defaultStyle = {
  top: "140px",
  width: "100%",
  position: "absolute",
  bottom: "45px",
};
const customStyle = {
  top: "50px",
  width: "100%",
  height: "20vh",
};

function CustomMap({ latitude, longitude, mapType = "start", locations = [] }) {
  const [directions, setDirections] = useState();
  const [originPosition, destinationPosition] = locations;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  console.log({ originPosition, destinationPosition, locations });
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const position = {
    lat: latitude || 12.903561,
    lng: longitude || 77.5939631,
  };
  useEffect(() => {}, [directions]);
  useEffect(() => {
    if (isLoaded && locations.length > 0) {
      const DirectionsService = new window.google.maps.DirectionsService();

      DirectionsService.route(
        {
          origin: new window.google.maps.LatLng(
            originPosition?.Lat || latitude,
            originPosition?.Lng || longitude,
          ),
          destination: new window.google.maps.LatLng(
            destinationPosition?.Lat || 25.624,
            destinationPosition?.Lng || 85.04,
          ),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        },
      );
    }
    return () => {};
  }, [isLoaded, locations]);

  // const mapHeight =
  //   mapType === "end"
  //     ? " -webkit-calc(100vh - 530px)"
  //     : " -webkit-calc(100vh - 230px)";
  console.log("location", latitude, longitude);
  return (
    <div>
      {isLoaded && (
        <div>
          <GoogleMap
            center={position}
            zoom={8}
            mapContainerStyle={mapType === "end" ? customStyle : defaultStyle}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <Marker position={position} />
            {locations.length > 0 && directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "black",
                  },
                }}
              />
            )}
          </GoogleMap>
        </div>
      )}
    </div>
  );
}

export default React.memo(CustomMap);
