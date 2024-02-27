import React, { useState, useEffect } from "react";
import { UserFields } from "../../../../core/fieldsSet";
import { userSave } from "../../../../core/apiClient";
import "./Registration_css.css";
import { useNavigate } from "react-router";
import Userimg from "./dummy-image.jpg";
import Upload from "./upload.png";
import Modal from "react-bootstrap/Modal";
import Success from "./success.png";
import DriverAppHeader from "../Header/Header";
import { LogOut } from "react-feather";
import DriverAppFooter from "../NavFooter/NavFooter";
import { getCookie, removeCookie } from "../../../../core/CookiesHandler";
import { LocalKey, DocumentType, AppRoutes } from "../../../../core/constant";
import { uploadFile } from "../../../Account/Account.Services";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { getAge } from "../SwitchButton/utils";

export default function Registration() {
  const User = JSON.parse(getCookie(LocalKey.saveUser)) || null;
  const [flag, setFlag] = useState(false);

  return (
    <div>
      <DriverAppHeader title={"Account"} />
      <div>
        {flag ? (
          <RegistrationSubmit />
        ) : (
          <RegistrationHome Flag={setFlag} User={User} />
        )}
      </div>
      <DriverAppFooter title="Account" />
    </div>
  );
}
const getDocumentDetails = (user, type) => {
  return (
    user?.DriverDocuments?.find((x) => x.Document === type)?.DocumentNumber ||
    ""
  );
};
function RegistrationHome({ Flag, User }) {
  const [name, setName] = useState(User.LongName || "");
  const [mobileno, setMobileNo] = useState(User.PhoneNumber || "");
  const [email, setEmail] = useState(User.Name || "");
  const [dob, setDateOfBirth] = useState(User.DateOfBirth || "");
  const isVerified = User?.Approved === "Y" ? true : false;
  const IsStore = User ? true : false;
  const isDataChange = !(
    name === User.LongName &&
    mobileno === User.PhoneNumber &&
    email === User.Name &&
    dob === User.DateOfBirth
  );
  const getUpload = () => {
    let userId = User.Id;
    const user = {
      Id: userId,
      LongName: name,
      Name: email,
      PhoneNumber: mobileno,
      DateOfBirth: dob,
    };

    const userData = {
      Users: [{ ...user }],
    };

    userSave("users/save/", userData, UserFields, IsStore, "driver").then(
      (res) => {},
    );
  };
  const isValid = getAge(dob);
  const NextButton = () => {
    if (name && mobileno && email && isValid) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            Flag(true);
            isDataChange && getUpload();
          }}
          className="btn btn-secondary coloract"
        >
          Next
        </button>
      );
    } else {
      return (
        <button type="button" className=" btn btn-secondary" disabled>
          Next
        </button>
      );
    }
  };

  const [file, setFile] = useState();
  function handleChange(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
  }
  return (
    <div>
      <div className="Registration-body">
        {/* <div className="logout" onClick={logout}>
          <LogOut />
          LogOut
        </div> */}

        <div className="imgcenter">
          {/* <input type="file" onChange={handleChange} />
          <img src={file} className="profileimg"/> */}
          <img src={Userimg} alt="Driver Image" className="profileimg" />
        </div>

        <div className="top-padding">
          <span className="bold-text">Name :</span>
          <span className="top-padding4 ">
            <input
              placeholder="Enter your Name"
              value={name}
              disabled={isVerified}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="top-padding4"
            />
          </span>
        </div>

        <div className="top-padding">
          <span className="bold-text">Email ID :</span>
          <span className="top-padding4 align-left">
            <input
              placeholder="Enter Your Email ID"
              type="text"
              value={email}
              disabled={isVerified}
              onChange={(e) => setEmail(e.target.value)}
              className="top-padding4"
            />
          </span>
        </div>

        <div className="top-padding">
          <span className="bold-text">Mobile Number :</span>
          <span className="top-padding4 align-left">
            <input
              placeholder="Enter Your Mobile Number"
              type="text"
              id="PhoneNumber"
              pattern="/^(\+\d{1,3}[- ]?)?\d{10}$/"
              title="Please Not Enter spaces"
              maxLength="10"
              minLength="10"
              value={mobileno}
              disabled={isVerified}
              onChange={(e) => setMobileNo(e.target.value)}
              className="top-padding4"
            />
          </span>
        </div>

        <div className="top-padding">
          <span className="bold-text">Date Of Birth :</span>
          <span className="top-padding4 align-left">
            <input
              placeholder="Enter Your Date Of Birth(YYYY-MM-DD)"
              type="text"
              value={dob}
              disabled={isVerified}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="top-padding4"
            />
          </span>
          {dob.length > 8 && !isValid && (
            <span className="color-red">
              Please enter valid date in (YYYY-MM-DD) format
            </span>
          )}
        </div>

        {!isVerified && (
          <div className="top-padding2">
            <NextButton />
          </div>
        )}
      </div>
    </div>
  );
}

function RegistrationSubmit() {
  const User = JSON.parse(getCookie(LocalKey.saveUser)) || null;
  const [showModal, setShowModal] = useState(false);
  const [eKycPassword, setEKycPassword] = useState("");
  const [PanNumber, setPanNumber] = useState("");
  const [LicenseNumber, setLicenseNumber] = useState("");
  const [eKycPasswordFile, setEKycPasswordFile] = useState("");
  const [PanNumberFile, setPanNumberFile] = useState("");
  const [LicenseNumberFile, setLicenseNumberFile] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    init();
  }, []);

  const renderImageTooltip = (props) => (
    <Tooltip {...props}>Upload JPG or PNG file</Tooltip>
  );
  const renderZipTooltip = (props) => (
    <Tooltip {...props}>Upload Zip file</Tooltip>
  );
  const init = () => {
    document.title = `taxi BPP - Account Information`;
    if (User && User?.DriverDocuments) {
      let LicenceNo = User?.DriverDocuments?.find(
        (x) => x.Document === DocumentType.Licence,
      )?.DocumentNumber;
      let PanNumber = User?.DriverDocuments?.find(
        (x) => x.Document === DocumentType.Pan,
      )?.DocumentNumber;
      setLicenseNumber(LicenceNo?.toUpperCase());
      setPanNumber(PanNumber?.toUpperCase());
    }
  };

  const getUpload = (e, type) => {
    let file = e.target.files[0];
    let formData = new FormData();
    let number = type === DocumentType.Licence ? LicenseNumber : PanNumber;
    let userId = User.Id;
    if (type === DocumentType.Licence || type === DocumentType.Pan) {
      formData.append("ADDRESS_LINE_1", User?.AddressLine1 || "");
      formData.append("ADDRESS_LINE_2", User?.AddressLine2 || "");
      formData.append("ADDRESS_LINE_3", User?.AddressLine3 || "");
      formData.append("CITY_NAME", User?.City?.Name || "");
      formData.append("STATE_NAME", User?.City?.State.Name || "");
      formData.append("EMAIL", User.Name);
      formData.append("PHONE_NUMBER", User.PhoneNumber);
      formData.append("DATE_OF_BIRTH", User.DateOfBirth);
    }

    formData.append("DOCUMENT", type);
    formData.append("FILE", file);
    formData.append("DRIVER_ID", userId);
    formData.append("DOCUMENT_NUMBER", number);
    type === DocumentType.Aadhar && formData.append("PASSWORD", eKycPassword);

    uploadFile("driver_documents/save", formData, "", true).then((res) => {
      console.log(`uploadData`, res.data.DriverDocument);
    });
  };

  function SubmitButton() {
    if (
      PanNumber &&
      LicenseNumber &&
      eKycPassword &&
      eKycPasswordFile &&
      LicenseNumberFile &&
      PanNumberFile
    ) {
      return (
        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="btn btn-secondary coloract"
        >
          <span className="cart">Submit</span>
        </button>
      );
    } else {
      return (
        <button type="button" className=" btn btn-secondary" disabled>
          Submit
        </button>
      );
    }
  }

  return (
    <>
      <div className="Registrationsubmit">
        <div className="top-padding">
          <span className="bold-text">Aadhaar Card :</span>
          <div className="top-padding4">
            <OverlayTrigger placement="top" overlay={renderZipTooltip}>
              <span className="upload-btn-wrapper">
                <label
                  className="uploadbtn"
                  htmlFor="AadharFile"
                  role={"button"}
                >
                  <img src={Upload} className="AccountIcon" />
                </label>
                <input
                  type="file"
                  id="AadharFile"
                  name="AadharFile"
                  onChange={(e) => {
                    setEKycPasswordFile(e.target.value);
                    getUpload(e, DocumentType.Aadhar);
                  }}
                />
              </span>
            </OverlayTrigger>
            <input
              placeholder="Enter your E-KYC Zip password."
              type="text"
              className="align-left top-padding4"
              value={eKycPassword}
              disabled={User?.DriverDocuments?.find(
                (x) => x.Document === DocumentType.Aadhar,
              )}
              onChange={(e) => setEKycPassword(e.target.value)}
            />
          </div>
        </div>

        <span className="mt-1 mb-0 small">
          {
            User?.DriverDocuments?.find(
              (x) => x.Document === DocumentType.Aadhar,
            )?.VerificationStatus
          }
        </span>

        <div className="top-padding">
          <span className="bold-text">PAN Number :</span>
          <div className="top-padding4">
            <OverlayTrigger placement="top" overlay={renderImageTooltip}>
              <span className="upload-btn-wrapper">
                <label className="uploadbtn" htmlFor="PanFile" role={"button"}>
                  <img src={Upload} className="AccountIcon" />
                </label>
                <input
                  type="file"
                  name="PanFile"
                  id="PanFile"
                  disabled={
                    PanNumber == "" ||
                    User?.DriverDocuments?.find(
                      (x) => x.Document === DocumentType.Pan,
                    )
                  }
                  onChange={(e) => {
                    setPanNumberFile(e.target.value);
                    getUpload(e, DocumentType.Pan);
                  }}
                />
              </span>
            </OverlayTrigger>
            <input
              placeholder="Enter your PAN Number"
              type="text"
              className="align-left bold-text top-padding4"
              value={PanNumber}
              disabled={User?.DriverDocuments?.find(
                (x) => x.Document === DocumentType.Pan,
              )}
              onChange={(e) => setPanNumber(e.target.value)}
            />
          </div>
        </div>

        <span className="mt-1 mb-0 small">
          {PanNumber ? (
            User?.DriverDocuments?.find((x) => x.Document === DocumentType.Pan)
              ?.VerificationStatus
          ) : !PanNumber ? (
            ""
          ) : (
            <span className="color-red">please enter valid Pan Number</span>
          )}
        </span>

        <div className="top-padding">
          <span className="bold-text">Driving License :</span>
          <div className="top-padding4">
            <OverlayTrigger placement="top" overlay={renderImageTooltip}>
              <span className="upload-btn-wrapper">
                <label
                  className="uploadbtn"
                  htmlFor="LicenseFile"
                  role={"button"}
                >
                  <img src={Upload} className="AccountIcon" />
                </label>
                <input
                  type="file"
                  name="LicenseFile"
                  id="LicenseFile"
                  disabled={
                    LicenseNumber == "" ||
                    User?.DriverDocuments?.find(
                      (x) => x.Document === DocumentType.Licence,
                    )
                  }
                  onChange={(e) => {
                    setLicenseNumberFile(e.target.value);
                    getUpload(e, DocumentType.Licence);
                  }}
                />
              </span>
            </OverlayTrigger>
            <input
              placeholder="Enter your Driving License Number"
              type="text"
              className="align-left bold-text top-padding4"
              value={LicenseNumber}
              disabled={User?.DriverDocuments?.find(
                (x) => x.Document === DocumentType.Licence,
              )}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
          </div>
        </div>
        {/* && /^[A-Za-z][0-9/\W/]{2,20}$/i.test(LicenseNumber) 
        && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(PanNumber)
        */}
        <span className="mt-1 mb-0 small">
          {LicenseNumber ? (
            User?.DriverDocuments?.find(
              (x) => x.Document === DocumentType.Licence,
            )?.VerificationStatus
          ) : !LicenseNumber ? (
            ""
          ) : (
            <span className="color-red">please enter valid License Number</span>
          )}
        </span>
        <div className="top-padding2">
          <SubmitButton />
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <div>
            <button
              className="close"
              onClick={() => {
                setShowModal(false);
                navigate(AppRoutes.driverDashboard);
              }}
            >
              ×
            </button>
          </div>

          <Modal.Body className="mbody">
            <div>
              <img src={Success} className="success" />
            </div>
            <br />
            <span className="bold-text">Registration successfull!</span>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
