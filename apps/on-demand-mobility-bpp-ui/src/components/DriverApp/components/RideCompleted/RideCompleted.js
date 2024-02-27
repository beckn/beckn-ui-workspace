import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./RideCompleted.css";
import Rectanglebar from "../Navigate/Rectangle-bar.png";

function RideStarted() {
  const [smShow, setSmShow] = useState(false);

  return (
    <>
      {smShow ? (
        <div className="bottomModal">
          <div className="rectangle-bar" onClick={() => setSmShow(!smShow)}>
            <button className="recbar">
              <img src={Rectanglebar} alt="Rectangle bar" />
            </button>
          </div>
          <div className="titlle" id="example-modal-sizes-title-sm">
            Ride Completed
          </div>
          <div>
            <div className="titlle-text" id="example-modal-sizes-title-sm">
              You have reached the destination
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <Button
        onClick={() => setSmShow(!smShow)}
        className="me-2-C fixed-bottom"
      >
        Collect Payment
      </Button>
      {/*<Modal
        className="popup"
        size="md"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
          <Modal.Title className="titlle" id="example-modal-sizes-title-sm">
            {RideStartedData.title}
          </Modal.Title>
        <Modal.Body>
          <h6 className="h5">{RideStartedData.subtitle}</h6>
        </Modal.Body>
  </Modal>*/}
    </>
  );
}

export default RideStarted;
