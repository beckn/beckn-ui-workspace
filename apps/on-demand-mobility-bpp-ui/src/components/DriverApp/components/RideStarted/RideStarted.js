import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ReadyStartData, RideStartedData } from "../DriveData";
import "./RideStarted.css";
import Rectanglebar from "../Navigate/Rectangle-bar.png";
import { CallLogIcon } from "../../../../shared/icons/CallLog";
import { CarLogIcon } from "../../../../shared/icons/CarLog";
import { MapPin } from "react-feather";
import { LocationIcon } from "../../../../shared/icons/Location";
import {
  startRide,
  endRide,
  triggerEvent,
} from "../SwitchButton/Driver.Services";
import RideEnd from "../EndRide/RideEnd";
import Address from "../Address/Address";
import { round } from "../../utils/utils";

import { currency, eventCode } from "../SwitchButton/utils";

function RideStarted({ trip, location }) {
  const [smShow, setSmShow] = useState({ status: false, data: undefined });
  const [rideDetail, setRideDetail] = useState(false);
  const handleStartRide = async () => {
    const res = await startRide(trip.Id).then((response) => response.data);
    setSmShow({ status: !smShow.status, data: res.Trip });
    triggerEvent(eventCode.startRide);
  };
  const handleEndRide = async () => {
    !isTripEnded &&
      (await endRide(trip.Id).then((response) => {
        triggerEvent(eventCode.endRide);
        return response;
      }));
    //setSmShow({ status: !smShow.status, data: res.Trip });
    isTripEnded && window.location.reload();
  };
  const status = smShow.data ? smShow.data.DisplayStatus : "Not Confirmed";
  const isTripEnded = trip.DisplayStatus === "Ended" ? true : false;

  return (
    <>
      {smShow.status ? (
        <div className="bottomModal">
          <div
            className="rectangle-bar"
            onClick={() => setRideDetail(!rideDetail)}
          >
            <button className="recbar">
              <img src={Rectanglebar} alt="Rectangle bar" />
            </button>
          </div>
          <div className="titlle" id="example-modal-sizes-title-sm">
            {!isTripEnded ? RideStartedData.title : "Ride Completed"}
          </div>
          <div>
            <div className="titlle-text" id="example-modal-sizes-title-sm">
              {!isTripEnded ? (
                <span>
                  You are on your way towards <br /> the drop locations
                </span>
              ) : (
                "You have reached the destination."
              )}
            </div>
          </div>
          {!isTripEnded && (
            <>
              <div className="carLog">
                <CarLogIcon />
              </div>
              <div className="callLog">
                <CallLogIcon />
              </div>
            </>
          )}
          <RideStartedExpand
            rideDetail={rideDetail}
            trip={trip}
            setRideDetail={setRideDetail}
            location={location}
          />
        </div>
      ) : (
        <div></div>
      )}
      {status === "Not Confirmed" ? (
        <Button onClick={handleStartRide} className="me-2 fixed-bottom">
          Start Ride
        </Button>
      ) : (
        <Button onClick={handleEndRide} className="me-2 fixed-bottom">
          {isTripEnded ? "Ride Ended" : "End Ride"}
        </Button>
      )}
    </>
  );
}

export default RideStarted;

function RideStartedExpand({ rideDetail, setRideDetail, location, trip }) {
  // if (trip.DisplayStatus === "Ended") {
  //   return (
  //     <>
  //       <RideEnd />
  //     </>
  //   );
  // }

  return (
    <>
      {rideDetail ? (
        <div className="bottomModal-R">
          <div className="rectangle-bar-R" onClick={() => setRideDetail(false)}>
            <button className="recbar-R">
              <img src={Rectanglebar} alt="Rectangle bar" />
            </button>
          </div>
          <div className="nevigate-body-R">
            <div>
              <div>
                <div className="titlle-R" id="example-modal-sizes-title-sm">
                  {RideStartedData.title}
                </div>
                <div className="carLog-R">
                  <CarLogIcon />
                </div>
                <div className="callLog-R">
                  <CallLogIcon />
                </div>
                <h6 className="h6-R">
                  <div>You are on your way towards</div>
                  the drop locations
                </h6>
              </div>

              <div>
                <hr className="hr-RS" />
              </div>

              <Address location={location} />

              <hr className="hrs-RS" />
              <h6 className="hd-RS">{ReadyStartData.TotalRide} :</h6>
              <h6 className="rs-RS">
                {currency} {round(trip.SellingPrice || ReadyStartData.Amount)}
              </h6>
              <p className="ps-RS">{ReadyStartData.Colletion}</p>
              <hr className="Cancelridehr-RS" />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
