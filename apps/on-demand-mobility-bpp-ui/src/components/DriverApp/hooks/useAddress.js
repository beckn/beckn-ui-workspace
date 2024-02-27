import React, { useEffect, useState } from "react";
import {
  getTrips,
  getDriverOnline,
} from "../components/SwitchButton/Driver.Services";
import Geocode from "react-geocode";
import { getAddress } from "../../../core/common.functions";
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
Geocode.setLocationType("ROOFTOP");
//to get address from lat and lng
const coordinateToAddress = async ({ latitude, longitude }) => {
  const response = await Geocode.fromLatLng(latitude, longitude).then(
    (response) => {
      return response;
    },
    (error) => {
      console.error(error);
    },
  );
  const address = response?.results[0]?.formatted_address;
  if (!address) {
    return response?.plus_code?.compound_code;
  }
  const formatResponse = address.split(",");
  const text = formatResponse[0] + formatResponse[1];
  if (text.length > 30) {
    return text.substr(0, 25);
  }
  return text;
};

export const useAddress = (rideData) => {
  const [address, setAddress] = useState({
    driverAddress: "NA",
    pickupAddress: "NA",
  });
  const getAddress = async () => {
    const driverLocation = await coordinateToAddress({
      latitude: rideData?.TripStops[0].Lat,
      longitude: rideData?.TripStops[0].Lng,
    });
    const addressDest = await coordinateToAddress({
      latitude: rideData?.TripStops[1].Lat,
      longitude: rideData?.TripStops[1].Lng,
    });
    setAddress({
      pickupAddress: addressDest || "NA",
      driverAddress: driverLocation || "NA",
    });
  };
  useEffect(() => {
    rideData && getAddress();
  }, [rideData]);

  return address;
};
