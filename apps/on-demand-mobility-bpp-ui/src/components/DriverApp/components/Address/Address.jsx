import React from "react";
import { MapPin } from "react-feather";
import "../RideStarted/RideStarted.css";
import { LocationIcon } from "../../../../shared/icons/Location";

function Address({ location }) {
  return (
    <div className="loc-RS">
      <span className="SourceAddress-RS">
        <LocationIcon fill="#80BC48" />
        <p className="sub-RS text-address">{location.driverAddress}</p>
      </span>
      <span className="MapPin-RS">
        {/* <MapPin color="#D22323" className="map-RS" /> */}
        <LocationIcon fill="#D22323" />
        <p className="dest-RS text-address">{location.pickupAddress}</p>
      </span>
    </div>
  );
}

export default Address;
