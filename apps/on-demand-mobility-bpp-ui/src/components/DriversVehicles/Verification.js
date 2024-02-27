import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { getAddress, getKeyValueFromString } from "../../core/common.functions";
import { DocumentType } from "../../core/constant";
import { verificationKeys } from "../../shared/constant";
import { FileText } from "react-feather";

export const Verification = (props) => {
  const [isValid, setIsValid] = useState({});
  useEffect(() => {
    if (props.verify === verificationKeys.verifyVehicle) {
      console.log("Verification", props);
    }
  }, [props]);

  const verifyDocument = (val, docId, id) => {
    let docObj = { ...isValid };
    if (val.length === 4 && val === docId.slice(docId.length - 4)) {
      docObj[id] = true;
    } else {
      docObj[id] = false;
    }
    setIsValid(docObj);
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.verify === verificationKeys.verifyDriver
            ? "Driver"
            : "Vehicle"}{" "}
          Verification{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col">
            {props.verify === verificationKeys.verifyDriver ? (
              <>
                <h5>{props.verifyDocuments?.LongName}</h5>
                <hr />
                <div>
                  <b>Address:</b>{" "}
                  {props.verifyDocuments && getAddress(props.verifyDocuments)}
                </div>
                <div>
                  <b>Mobile:</b> {props.verifyDocuments?.PhoneNumber}
                </div>
                <div>
                  <b>DOB:</b> {props.verifyDocuments?.DateOfBirth}
                </div>
                <div>
                  <b>Date Of Joining:</b> {props.verifyDocuments?.DateOfJoining}
                </div>
              </>
            ) : (
              <>
                <h5>
                  {props.verifyDocuments?.VehicleNumber} |{" "}
                  <span className="small text-muted">
                    Date of Registration:{" "}
                    {
                      props.verifyDocuments?.VehicleDocuments?.find(
                        (x) => x.Document === DocumentType.RC,
                      ).ValidFrom
                    }
                  </span>
                </h5>
                <hr />
                <div>
                  <b>Make:</b>{" "}
                  {getKeyValueFromString("Make", props.verifyDocuments?.Tags)}
                </div>
                <div>
                  <b>Name of Model:</b>{" "}
                  {getKeyValueFromString(
                    "NameOfModel",
                    props.verifyDocuments?.Tags,
                  )}
                </div>
                <div>
                  <b>Fuel Type:</b>{" "}
                  {getKeyValueFromString(
                    "FuelType",
                    props.verifyDocuments?.Tags,
                  )}
                </div>
                <div>
                  <b>Vehicle Type:</b>{" "}
                  {getKeyValueFromString(
                    "VehicleType",
                    props.verifyDocuments?.Tags,
                  )}
                </div>
              </>
            )}
            <hr />
            <h5>Uploaded Documents</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Document Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {props.verifyDocuments &&
                  props.verifyDocuments[
                    props.verify === verificationKeys.verifyVehicle
                      ? "VehicleDocuments"
                      : "DriverDocuments"
                  ]?.map((x) => {
                    return (
                      <tr>
                        <td>{x.Document}</td>
                        <td>
                          <div className="d-flex align-items-center justify-content-around">
                            <div>
                              <input
                                type="text"
                                maxlength="4"
                                className="form-control form-control-sm text-truncate"
                                placeholder={`last 4 digits of ${x.Document}`}
                                onChange={(e) =>
                                  verifyDocument(
                                    e.target.value,
                                    x.DocumentNumber,
                                    x.Id,
                                  )
                                }
                              />
                            </div>
                            <a
                              href={x.ImageUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <FileText size="2em" />
                            </a>
                          </div>
                        </td>
                        <td>
                          {x.Verified === "Y" ? (
                            "Verified"
                          ) : (
                            <div className="d-flex justify-content-around">
                              <button
                                className="btn btn-primary btn-sm"
                                disabled={!isValid[x.Id]}
                                onClick={() =>
                                  props.onUpdate(
                                    { id: x.Id, verifyType: "verify" },
                                    props.verify ===
                                      verificationKeys.verifyDriver
                                      ? "driver_documents"
                                      : "vehicle_documents",
                                  )
                                }
                              >
                                Verify
                              </button>

                              <button
                                className="btn btn-danger ml-2 btn-sm"
                                disabled={isValid[x.id]}
                                onClick={() =>
                                  props.onUpdate(
                                    { id: x.Id, verifyType: "reject" },
                                    props.verify ===
                                      verificationKeys.verifyDriver
                                      ? "driver_documents"
                                      : "vehicle_documents",
                                  )
                                }
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleModalClose}>
          Close
        </button>
        <button className="btn btn-primary" onClick={handleVerifyDriver}>
          Save Changes
        </button>
      </Modal.Footer> */}
    </>
  );
};

export default Verification;
