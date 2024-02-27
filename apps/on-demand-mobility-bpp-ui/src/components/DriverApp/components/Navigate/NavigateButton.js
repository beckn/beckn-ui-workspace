import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import Pickup from "../Pickup/pickup";
import ReadyStart from "../ReadyToStart/ReadyToStart";
import RideCompleted from "../RideCompleted/RideCompleted";
import RideStarted from "../RideStarted/RideStarted";
import { getTripStatus } from "../SwitchButton/Driver.Services";
import { useInterval } from "../../hooks/useInterval";
import { AppRoutes } from "../../../../core/constant";
import { setActiveRide } from "../../../../core/common.functions";
import { round } from "../../utils/utils";

function NavigateButton({ location, trip }) {
  const navigate = useNavigate();
  const { DisplayStatus } = trip;
  const [ride, setRide] = useState(trip);
  const counter = useRef(0);
  counter.current = counter.current + 1;
  const getRideData = async () => {
    const res = await getTripStatus(trip, location);
    if (DisplayStatus !== res.DisplayStatus) {
      setRide(res);
    }
  };
  const isActive = ride.DisplayStatus === "Ended" ? false : true;

  useInterval(
    () => {
      getRideData();
    },
    isActive ? 4000 : null,
  );

  useEffect(() => {
    if (!isActive) {
      navigate(AppRoutes.endRide);
    }
  }, [ride]);

  return (
    <>
      {counter.current > 4 ? (
        <RideStarted location={location} trip={ride} />
      ) : (
        <Pickup location={location} trip={ride} />
      )}
    </>
  );
}

export default NavigateButton;
