import React, { useState, useEffect } from "react";
import DriverAppHeader from "./components/Header/Header";
import DriverAppFooter from "./components/NavFooter/NavFooter";
import { usePosition } from "./hooks/usePosition";
import CustomMap from "./Maps/CustomMap";
import SwitchButton from "./components/SwitchButton/SwitchButton";
import NavigateButton from "./components/Navigate/NavigateButton";
import { getCookie, setCookie, removeCookie } from "../../core/CookiesHandler";
import { LocalKey, DocumentType, AppRoutes } from "../../core/constant";
import { Link, useNavigate } from "react-router-dom";

function DriverDashboard() {
  const [locations, setLocations] = useState();

  const navigate = useNavigate();
  const User = JSON.parse(getCookie(LocalKey.saveUser)) || null;
  const isVerified = User?.Approved === "Y" ? true : false;
  console.log(isVerified);
  const { latitude, longitude, error } = usePosition();
  const init = () => {
    document.title = `Driver App`;
  };
  useEffect(() => {
    setCookie(LocalKey.saveActiveRide, JSON.stringify({}), "/");
    init();
    if (!isVerified) {
      navigate(AppRoutes.accountRegistration);
    }
  }, []);
  return (
    <div>
      <div>
        <DriverAppHeader title={"Home"} />
        <div>
          <div className="radio fixed-top">
            <SwitchButton
              latitude={latitude}
              longitude={longitude}
              setLocations={setLocations}
            />
          </div>
          <CustomMap
            latitude={latitude}
            longitude={longitude}
            locations={locations}
          />
          {/*<div className="fixed-bottom">
            <NavigateButton />
          </div>*/}
        </div>
        <DriverAppFooter title="Home" />
      </div>
    </div>
  );
}

export default DriverDashboard;
