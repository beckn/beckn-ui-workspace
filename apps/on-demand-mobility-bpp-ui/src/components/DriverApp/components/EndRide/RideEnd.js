import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { LocationIcon as MapPin } from "../../../../shared/icons/Location";
import DriverAppFooter from "../NavFooter/NavFooter";
import { LocationIcon } from "../../../../shared/icons/Location";
import { LocalKey, AppRoutes } from "../../../../core/constant";
import CustomMap from "../../Maps/CustomMap";
import { EndRideData } from "../DriveData";
import "./RideEnd.css";
import { getCookie, removeCookie } from "../../../../core/CookiesHandler";
import { round } from "../../utils/utils";
import { usePosition } from "../../hooks/usePosition";
import { currency } from "../SwitchButton/utils";
import { setActiveRide } from "../../../../core/common.functions";

const formatDate = (date) => {
  return date?.split(" ")[0] || "NA";
};
function RideEnd() {
  const navigate = useNavigate();

  const { latitude, longitude, error } = usePosition();

  const {
    res: rideSummary,
    location,
    distance,
  } = JSON.parse(getCookie(LocalKey.saveActiveRide)) || null;

  useEffect(() => {
    if (!rideSummary) {
      removeCookie(LocalKey.saveActiveRide);
      navigate(AppRoutes.driverDashboard);
    }
    return () => {
      setActiveRide({});
    };
  }, []);
  return (
    <>
      <div className="m-3">
        <h1 className="titleP">{EndRideData.title}</h1>
        <p className="subP">{EndRideData.Subtitle}</p>
        {/* <h2 className="Rp">
          {currency} {round(rideSummary.SellingPrice) || 0}
        </h2> */}
        <div className="d-flex mt-3 justify-content-between px-2 Rp">
          <h2>{rideSummary?.Passenger?.Name || ""}</h2>
          <h2>
            {currency} {round(rideSummary?.SellingPrice) || 0}
          </h2>
        </div>

        <hr className="hrp" />
        <div className="d-flex mt-5 justify-content-between px-3">
          <h6>{formatDate(rideSummary?.CreatedAt)}</h6>
          <h6>
            Distance : <b>{round(distance) || 0} Kms</b>
          </h6>
        </div>

        {/* <h6 className="tm">{EndRideData.Time}</h6> */}

        <div className="mx-3">
          <span
            title="pickup point"
            className="d-flex mt-3 align-left gap-4 text-address"
          >
            <MapPin fill="#80BC48" />
            {location?.driverAddress}
          </span>
          <span
            title="destination point"
            className="d-flex mt-3 gap-4 text-address"
          >
            <MapPin fill="#D22323" />
            {location?.pickupAddress}
          </span>
        </div>
        <CustomMap mapType="end" latitude={latitude} longitude={longitude} />
        <button className="End fixed-bottom" onClick={() => navigate(-1)}>
          Search Another Ride
        </button>
      </div>
      <DriverAppFooter title="Home" />
    </>
  );
}

export default RideEnd;
