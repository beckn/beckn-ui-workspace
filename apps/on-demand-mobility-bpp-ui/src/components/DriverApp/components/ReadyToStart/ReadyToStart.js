import React, { useState } from "react";
import "./ReadyToStart.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { MapPin } from "react-feather";
import { CallLogIcon } from "../../../../shared/icons/CallLog";
import { CarLogIcon } from "../../../../shared/icons/CarLog";
import { LocationIcon } from "../../../../shared/icons/Location";
import { ReadyStartData } from "../DriveData";
import Rectanglebar from "../Navigate/Rectangle-bar.png";

function ReadyStart(props) {
  const [smShow, setSmShow] = useState(false);

  return (
    <>
      {smShow ? (
        <div className="bottomModal-R">
          <div className="rectangle-bar-R" onClick={() => setSmShow(!smShow)}>
            <button className="recbar-R">
              <img src={Rectanglebar} alt="Rectangle bar" />
            </button>
          </div>
          <div className="nevigate-body-R">
            <div>
              <div>
                <div className="titlle-R" id="example-modal-sizes-title-sm">
                  {ReadyStartData.title}
                </div>
                <div className="carLog-R">
                  <CarLogIcon />
                </div>
                <div className="callLog-R">
                  <CallLogIcon />
                </div>
                <h6 className="h6-R">{ReadyStartData.Subtitle}</h6>
              </div>

              <div>
                <hr className="hr-R" />
              </div>

              <div className="loc-R">
                <span className="SourceAddress-R">
                  <LocationIcon />
                  <p className="sub-R">{ReadyStartData.Location}</p>
                </span>
                <span className="MapPin-R">
                  <MapPin color="#D22323" className="map-R" />
                  <p className="dest-R">{ReadyStartData.Address}</p>
                </span>
              </div>

              <hr className="hrs-R" />
              <h6 className="hd-R">{ReadyStartData.TotalRide} :</h6>
              <h6 className="rs-R">{ReadyStartData.Amount}</h6>
              <p className="ps-R">{ReadyStartData.Colletion}</p>
              <hr className="Cancelridehr-R" />
              <h6 className="ride-R">{ReadyStartData.Ride}</h6>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <Button onClick={() => setSmShow(!smShow)} className="me-2 fixed-bottom">
        Start Ride
      </Button>
      {/*<Modal
        className="popup"
        size="md"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
      <Modal.Title className="titlle" id="example-modal-sizes-title-sm">
        {ReadyStartData.title}
        </Modal.Title>
        <Modal.Body>
          <div className="carLog">
            <CarLogIcon />
          </div>
          <div className="callLog">
            <CallLogIcon />
          </div>
          <h6 className="h6">{ReadyStartData.Subtitle}</h6>
          <hr className="hr" />
          <div className="loc">
            <LocationIcon />
            <span className="MapPin">
        <MapPin color="#D22323" className="map" />
      {ReadyStartData.Address}
      </span>
          </div>
          <p className="sub">{ReadyStartData.Location}</p>
          <hr className="hrs" />
          <h6 className="hd">{ReadyStartData.TotalRide}</h6>
          <h6 className="rs">{ReadyStartData.Amount}</h6>
          <p className="ps">{ReadyStartData.Colletion}</p>
          <h6 className="ride">{ReadyStartData.Ride}</h6>
        </Modal.Body>
      </Modal>*/}
    </>
  );
}

export default ReadyStart;
