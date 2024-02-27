import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Upload } from "react-feather";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  getKeyValueFromString,
  setObjectToString,
  setValue,
} from "../../../core/common.functions";
import { DocumentType } from "../../../core/constant";
import { VehicleFuelType, VehicleTags } from "../../../shared/constant";
import { uploadFile } from "../../Account/Account.Services";
import {
  getDeploymentPurposes,
  saveVehicle,
} from "../DriversVehicles.Services";
import { yupResolver } from "@hookform/resolvers/yup";
import { getVehicleInfoSchema } from "./AddVehicle.schema";
import { ErrorMessage } from "../../../shared/ErrorMessage/ErrorMessage";

const VehicleInfoForm = ({
  dispatchEvent,
  vehicleInfo,
  newVehicleInfo,
  vehicleEdit,
  setNewVehicleInfo,
  onUpdateVehicle,
  contextData,
}) => {
  const [isDisabled, setIsDisabled] = useState(
    !isEmpty(newVehicleInfo) || !vehicleEdit,
  );

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "all",
    resolver: yupResolver(getVehicleInfoSchema()),
    defaultValues: {
      VehicleNumber: vehicleInfo.VehicleNumber,
      Make: vehicleInfo.Make,
      NameOfModel: vehicleInfo.NameOfModel,
      VehicleType: vehicleInfo.VehicleType,
      FuelType: vehicleInfo.FuelType,
    },
  });

  useEffect(() => {
    setValue("VehicleNumber", vehicleInfo.VehicleNumber);
    setValue("Make", vehicleInfo.Make);
    setValue("NameOfModel", vehicleInfo.NameOfModel);
    setValue("VehicleType", vehicleInfo.VehicleType);
    setValue("FuelType", vehicleInfo.FuelType);
  }, [
    setValue,
    vehicleInfo.FuelType,
    vehicleInfo.Make,
    vehicleInfo.NameOfModel,
    vehicleInfo.VehicleNumber,
    vehicleInfo.VehicleType,
  ]);

  const onSubmit = (data) => {
    console.log("submitting");

    let addVehicleInfo = {
      Vehicle: {
        VehicleNumber: data.VehicleNumber,
        Tags: setObjectToString({
          ...vehicleInfo,
          ...data,
        }),
      },
    };

    if (newVehicleInfo && vehicleEdit) {
      addVehicleInfo.Vehicle.Id = newVehicleInfo.Id;
    }

    saveVehicle(addVehicleInfo).then((res) => {
      setNewVehicleInfo(res.data.Vehicles[0]);
      onUpdateVehicle();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col">
          <h3 className="mb-0">Add/Edit Vehicle:</h3>
        </div>
        <div className="col text-end">
          {!isDisabled ? (
            <>
              <button
                className="btn btn-sm btn-secondary me-3"
                type="button"
                onClick={(e) => {
                  console.log("resetting");
                  reset();
                  dispatchEvent(e);
                }}
              >
                cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                type="submit"
                disabled={!isValid || !isDirty}
              >
                Save
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-primary me-3"
              type="button"
              onClick={(e) => setIsDisabled(false)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-6 mb-3">
          <input
            type="text"
            className={classNames({
              "form-control": true,
              error: errors?.VehicleNumber,
            })}
            {...register("VehicleNumber")}
            disabled={isDisabled}
            id="VehicleNumber"
            placeholder="Enter Vehicle Number"
          />
          <ErrorMessage fieldError={errors?.VehicleNumber} />
        </div>
        <div className="col-6 mb-3">
          <input
            type="text"
            className={classNames({
              "form-control": true,
              error: errors?.Make,
            })}
            {...register("Make")}
            id="Make"
            disabled={isDisabled}
            placeholder="Enter Vehicle Make"
          />
          <ErrorMessage fieldError={errors?.Make} />
        </div>
      </div>
      <div className="row">
        <div className="row w-100 justify-content-left">
          <div className="col-4 mb-3">
            <input
              type="text"
              className={classNames({
                "form-control": true,
                error: errors?.NameOfModel,
              })}
              {...register("NameOfModel")}
              disabled={isDisabled}
              id="NameOfModel"
              placeholder="Enter Vehicle Model"
            />
            <ErrorMessage fieldError={errors?.NameOfModel} />
          </div>
          <div className="col-4 mb-3">
            <select
              {...register("VehicleType")}
              disabled={isDisabled}
              id="VehicleType"
              className={classNames({
                "form-select": true,
                error: errors?.VehicleType,
              })}
            >
              <option value="">Select Vehicle Type</option>
              {contextData.VehicleType.map((t, i) => (
                <option key={i} value={t.Name}>
                  {t.Name}
                </option>
              ))}
            </select>
            <ErrorMessage fieldError={errors?.VehicleType} />
          </div>
          <div className="col-4 mb-3">
            <select
              {...register("FuelType")}
              id="FuelType"
              disabled={isDisabled}
              className={classNames({
                "form-select": true,
                error: errors?.FuelType,
              })}
            >
              <option value="">Select Vehicle Fuel Type</option>
              {VehicleFuelType.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ErrorMessage fieldError={errors?.FuelType} />
          </div>
        </div>
      </div>
    </form>
  );
};

export const AddVehicle = (props) => {
  const [vehicleInfo, setVehicleInfo] = useState({
    VehicleNumber: "",
    Make: "",
    NameOfModel: "",
    VehicleType: "",
    FuelType: "",
    ValidFrom: null,
    ValidTo: null,
    RcNumber: "",
    InsuranceNumber: "",
    FitnessNumber: "",
    otherFields: {
      autocompleteMakeData: [],
      autocompleteNameOfModelData: [],
    },
  });
  const [contextData, setContextData] = useState({
    VehicleType: [],
  });
  const [newVehicleInfo, setNewVehicleInfo] = useState({});

  const [documentsInfo, setDocumentsInfo] = useState({
    RcDoc: {
      VALID_FROM: null,
      VALID_TO: null,
      DOCUMENT_NUMBER: "",
      FILE: {},
      DOCUMENT: DocumentType.RC,
    },
    InsDoc: {
      DOCUMENT_NUMBER: "",
      FILE: {},
      DOCUMENT: DocumentType.INSURANCE,
    },
    FitDoc: {
      DOCUMENT_NUMBER: "",
      FILE: {},
      DOCUMENT: DocumentType.FITNESS,
    },
  });
  const { RcNumber, InsuranceNumber, FitnessNumber } = vehicleInfo;
  const dispatchEvent = (e) => {
    props.onChange(e);
  };

  useEffect(() => {
    setNewVehicleInfo(props.vehicleEdit);
    getDeploymentPurposes().then((res) => {
      setContextData({
        VehicleType: res.data.DeploymentPurposes,
      });
      console.log("getDeploymentPurposes", res.data.DeploymentPurposes);
    });
    setVehicleInfo((vehicleInfo) => {
      let upInfo = vehicleInfo;
      let tags = props.vehicleEdit.Tags;
      Object.keys(upInfo).forEach((v) => {
        if (VehicleTags.includes(v)) {
          console.log(v, getKeyValueFromString(v, tags));
          upInfo = {
            ...upInfo,
            [v]: getKeyValueFromString(v, tags),
          };
        }
      });

      return {
        ...upInfo,
        VehicleNumber: props.vehicleEdit.VehicleNumber,
        ValidFrom: props.vehicleEdit.VehicleDocuments?.find(
          (x) => x.Document === DocumentType.RC,
        ).ValidFrom,
        ValidTo: props.vehicleEdit.VehicleDocuments?.find(
          (x) => x.Document === DocumentType.RC,
        ).ValidTo,
        RcNumber: props.vehicleEdit.VehicleDocuments?.find(
          (x) => x.Document === DocumentType.RC,
        ).DocumentNumber,
        InsuranceNumber: props.vehicleEdit.VehicleDocuments?.find(
          (x) => x.Document === DocumentType.INSURANCE,
        ).DocumentNumber,
        FitnessNumber: props.vehicleEdit.VehicleDocuments?.find(
          (x) => x.Document === DocumentType.FITNESS,
        ).DocumentNumber,
      };
    });
  }, [props.vehicleEdit]);

  const setDocumentValue = (e, type) => {
    let docInfo = documentsInfo;
    if (e.target) {
      e.preventDefault();
      const { name, value, type, files } = e.target;
      setValue(name, type === "file" ? files[0] : value, docInfo);
      setDocumentsInfo({
        ...docInfo,
      });
    } else {
      setValue(type, new Date(e).toISOString(), docInfo);
      setDocumentsInfo({
        ...docInfo,
      });
    }
  };

  const submitDocuments = (e) => {
    e.preventDefault();
    let data = [];
    Object.keys(documentsInfo).forEach((v, index) => {
      let formData = new FormData();
      formData.append("VEHICLE_ID", newVehicleInfo.Id);
      Object.keys(documentsInfo[v]).forEach((f, i) => {
        console.log("append", f, documentsInfo[v][f]);
        formData.append(f, documentsInfo[v][f]);
      });
      data.push(uploadFile("vehicle_documents/save", formData, "", false));
    });
    Promise.all(data).then((res) => {
      toast.success("Document upload successfully!!");
      props.onChange(e);
    });
  };

  return (
    <>
      <VehicleInfoForm
        dispatchEvent={dispatchEvent}
        vehicleInfo={vehicleInfo}
        newVehicleInfo={newVehicleInfo}
        vehicleEdit={props.vehicleEdit}
        setNewVehicleInfo={setNewVehicleInfo}
        onUpdateVehicle={props.onUpdateVehicle}
        contextData={contextData}
      />

      {!isEmpty(newVehicleInfo) && (
        <>
          <div className="row mt-3">
            <div className="col">
              <h5>Document Upload</h5>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="row">
              <div className="row w-100 justify-content-left">
                <div className="col-4  mb-3">
                  <ReactDatePicker
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    id="ValidFrom"
                    placeholderText="Enter R.C. Start Date"
                    className="form-control"
                    selected={
                      documentsInfo.RcDoc.VALID_FROM
                        ? new Date(documentsInfo.RcDoc.VALID_FROM)
                        : documentsInfo.RcDoc.VALID_FROM
                    }
                    onChange={(date) =>
                      setDocumentValue(date, "RcDoc.VALID_FROM")
                    }
                  />
                </div>
                <div className="col-4  mb-3">
                  <ReactDatePicker
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    id="ValidTo"
                    placeholderText="Enter R.C. End Date"
                    className="form-control"
                    selected={
                      documentsInfo.RcDoc.VALID_TO
                        ? new Date(documentsInfo.RcDoc.VALID_TO)
                        : documentsInfo.RcDoc.VALID_TO
                    }
                    onChange={(date) =>
                      setDocumentValue(date, "RcDoc.VALID_TO")
                    }
                  />
                </div>
                <div className="col-3">
                  <input
                    type="text"
                    name="RcDoc.DOCUMENT_NUMBER"
                    id="RcNumber"
                    defaultValue={
                      documentsInfo.RcDoc.DOCUMENT_NUMBER || RcNumber
                    }
                    onChange={(e) => setDocumentValue(e)}
                    className="form-control"
                    placeholder="Enter Vehicle R.C. Number"
                  />
                  {!isEmpty(newVehicleInfo) && (
                    <p>
                      {newVehicleInfo.VehicleDocuments?.find(
                        (x) => x.Document === DocumentType.RC,
                      ).Verified === "Y"
                        ? "Verified"
                        : "R.C. Verification Pending"}
                    </p>
                  )}
                </div>
                <div className="col-1 mb-5 align-self-center">
                  <input
                    type="file"
                    name="RcDoc.FILE"
                    id="RcFile"
                    className="form-control d-none"
                    onChange={(e) => setDocumentValue(e)}
                  />
                  <label htmlFor="RcFile" role={"button"}>
                    <Upload />
                  </label>
                </div>
              </div>
            </div>
            <div className="row w-100 justify-content-left">
              <div className="col-3 mb-3">
                <input
                  type="text"
                  name="InsDoc.DOCUMENT_NUMBER"
                  defaultValue={
                    documentsInfo.InsDoc.DOCUMENT_NUMBER || InsuranceNumber
                  }
                  id="InsuranceNumber"
                  onChange={(e) => setDocumentValue(e)}
                  className="form-control"
                  placeholder="Enter Vehicle Insurance Number"
                />
                {!isEmpty(newVehicleInfo) && (
                  <p>
                    {newVehicleInfo.VehicleDocuments?.find(
                      (x) => x.Document === DocumentType.INSURANCE,
                    ).Verified === "Y"
                      ? "Verified"
                      : "Insurance Verification Pending"}
                  </p>
                )}
              </div>
              <div className="col-1 mb-5 align-self-center">
                <input
                  type="file"
                  name="InsDoc.FILE"
                  id="InsuranceFile"
                  className="form-control d-none"
                  onChange={(e) => setDocumentValue(e)}
                />
                <label htmlFor="InsuranceFile" role={"button"}>
                  <Upload />
                </label>
              </div>
              <div className="col-3 mb-3">
                <input
                  type="text"
                  name="FitDoc.DOCUMENT_NUMBER"
                  defaultValue={
                    documentsInfo.FitDoc.DOCUMENT_NUMBER || FitnessNumber
                  }
                  id="FitnessNumber"
                  onChange={(e) => setDocumentValue(e)}
                  className="form-control"
                  placeholder="Enter Vehicle Fitness Certificate Number"
                />
                {!isEmpty(newVehicleInfo) && (
                  <p>
                    {newVehicleInfo.VehicleDocuments?.find(
                      (x) => x.Document === DocumentType.FITNESS,
                    ).Verified === "Y"
                      ? "Verified"
                      : "Fitness Verification Pending"}
                  </p>
                )}
              </div>
              <div className="col-1 mb-5 align-self-center">
                <input
                  type="file"
                  name="FitDoc.FILE"
                  id="FitnessFile"
                  className="form-control d-none"
                  onChange={(e) => setDocumentValue(e)}
                />
                <label htmlFor="FitnessFile" role={"button"}>
                  <Upload />
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-end">
              <button
                className="btn btn-sm btn-secondary me-3"
                onClick={(e) => dispatchEvent(e)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={(e) => submitDocuments(e)}
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddVehicle;
