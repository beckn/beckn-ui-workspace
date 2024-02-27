import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RideStarted from "../RideStarted/RideStarted";
import { startRide, endRide } from "../SwitchButton/Driver.Services";
import { CallLogIcon } from "../../../../shared/icons/CallLog";
import { CarLogIcon } from "../../../../shared/icons/CarLog";
import { LocationIcon } from "../../../../shared/icons/Location";
import "./pickup.css";
import Rectanglebar from "../Navigate/Rectangle-bar.png";
import { triggerEvent } from "../SwitchButton/Driver.Services";
import { eventCode } from "../SwitchButton/utils";

function NavigateButton({ trip, location }) {
  const [next, setNext] = useState(false);

  const handleNavigate = async () => {
    setNext(true);
    triggerEvent(eventCode.sendLocation);

    //const res = await startRide(trip.Id).then((response) => response.data);
  };
  return (
    <>
      <>
        <div className="bottomModal-P">
          <div className="rectangle-bar-P">
            <button className="recbar-P">
              {/* <img src={Rectanglebar} alt="Rectangle bar" /> */}
            </button>
          </div>
          <div className="nevigate-body-P">
            <div className="titlle-P" id="example-modal-sizes-title-sm">
              Going for Pickup
            </div>
            <div>
              <div className="carLog-P">
                <CarLogIcon />
              </div>
              <div className="callLog-P">
                <CallLogIcon />
              </div>
              <h6 className="h6-P">Reach pick up location in 5 mins.</h6>
              <br />
              <div className="">
                <br />
                <hr className="hr-P" />
                <div className="loc-P">
                  <LocationIcon fill="#80BC48" />
                </div>
                <div className="sub-P">{location.driverAddress}</div>
                <div>
                  <span className="min-P">5 min away</span>
                  <span className="kms-P">2.5kms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {next ? (
          <div className="bottomModal-P">
            <div className="rectangle-bar-P">
              <button className="recbar-P">
                {/* <img src={Rectanglebar} alt="Rectangle bar" /> */}
              </button>
            </div>
            <div className="nevigate-body-P">
              <div className="titlle-P" id="example-modal-sizes-title-sm">
                Reached Pickup
              </div>
              <div>
                <div className="carLog-P">
                  <CarLogIcon />
                </div>
                <div className="callLog-P">
                  <CallLogIcon />
                </div>
                <h6 className="h6-P">You have Reached pick up location</h6>
                <br />
                <div className="">
                  <br />
                  <hr className="hr-P" />
                  <div className="loc-P">
                    <LocationIcon fill="#80BC48" />
                  </div>
                  <div className="sub-P">{location.driverAddress}</div>
                  {/* <div>
                    <span className="min-P hidden">5 min away</span>
                    <span className="kms-P">2.5kms</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </>
      )
      <Button onClick={handleNavigate} className="me-2 fixed-bottom">
        {!next ? "Navigate" : "Reached Pickup"}
      </Button>
    </>
  );
}

export default NavigateButton;
