import isEmpty from "lodash/isEmpty";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getDeploymentPurposes } from "../../DriversVehicles/DriversVehicles.Services";
import { removedFarePolicies, saveTariffCard } from "../FarePolicy.Services";

const defaultTariffCard = {
  FromKms: "",
  ToKms: "",
  PricePerKm: "",
  DeploymentPurpose: { Id: "" },
};

export const AddFarePolicy = ({ existingFare, onChange, EditFare }) => {
  const PurposeRef = useRef(null);
  const [FareStore, setFareStore] = useState({
    DeploymentPurposes: [],
    RemovedTariff: [],
    TariffCards: {},
  });

  useEffect(() => {
    console.log("EditFare", EditFare);
    getDeploymentList();
  }, []);

  const getDeploymentList = () => {
    // let key = JSON.parse(PurposeRef.current.value).Name;
    // PurposeRef.current["selectedvalue"] = EditFare[0].DeploymentPurpose.Name;

    console.log("getDeploymentList", EditFare);

    getDeploymentPurposes().then((res) => {
      let existingFareTypes = [
        ...new Set(existingFare.map((x) => x.DeploymentPurpose.Name)),
      ];
      let AvailableDeploymentPurposes = [];
      res.data.DeploymentPurposes.map((x) => {
        !existingFareTypes.includes(x.Name) &&
          AvailableDeploymentPurposes.push(x);
      });
      setFareStore({
        ...FareStore,
        DeploymentPurposes:
          AvailableDeploymentPurposes || res.data.DeploymentPurposes,
        TariffCards: EditFare && getTariffCards(EditFare),
      });
    });
  };

  const getTariffCards = (arrayList) => {
    let EditTariff = {};
    arrayList.forEach((v) => {
      console.log("getTariffCards", v);
      if (EditTariff[v.DeploymentPurpose.Name]) {
        EditTariff[v.DeploymentPurpose.Name].push(v);
      } else {
        EditTariff[v.DeploymentPurpose.Name] = [v];
      }
    });
    return EditTariff;
  };

  const setInputValue = (e) => {
    let { name, value, dataset } = e.target;
    if (name === "DeploymentPurpose") {
      if (value) {
        if (EditFare) {
          EditFare.forEach((v) => {
            v.DeploymentPurpose = JSON.parse(value);
          });
          console.log("DeploymentPurpose", EditFare, getTariffCards(EditFare));
          setFareStore({
            ...FareStore,
            TariffCards: getTariffCards(EditFare),
          });
        } else {
          let Vobj = JSON.parse(value);
          let copy = Object.assign({}, defaultTariffCard);
          copy.DeploymentPurpose.Id = Vobj.Id;
          setFareStore({
            ...FareStore,
            TariffCards: { [Vobj.Name]: [copy] },
          });
        }
      } else {
        setFareStore({
          ...FareStore,
          TariffCards: {},
        });
      }
    } else {
      let key = JSON.parse(PurposeRef.current.value).Name;
      let copy = JSON.parse(JSON.stringify(FareStore.TariffCards[key]));
      copy.forEach((v, i) => {
        +dataset.index === i && (v[name] = value);
      });

      setFareStore({
        ...FareStore,
        TariffCards: {
          [key]: copy,
        },
      });
      // console.log("setInputValue", key, name, value, dataset.index, copy);
    }
    // let newValue = name === "DeploymentPurpose" ? { Id: value } : value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (FareStore.RemovedTariff.length !== 0) {
      let data = [];
      // removedFarePolicies
      FareStore.RemovedTariff.forEach((x) => {
        data.push(removedFarePolicies(x.Id));
      });
      Promise.all(data).then((res) => {
        toast.success("Fare Policy Create/Update Successfully!");
        onChange(false);
      });
    } else {
      let store = [];
      let value = JSON.parse(PurposeRef.current.value).Name;
      console.log(PurposeRef.current.value, value);
      FareStore.TariffCards[value].forEach((element) => {
        EditFare && (element.Id = EditFare.Id);
        store.push({
          TariffCard: element,
        });
      });

      let data = {
        TariffCards: store,
      };

      saveTariffCard(data).then((res) => {
        toast.success("Fare Policy Create/Update Successfully!");
        res.data && onChange(false);
      });
    }
  };

  const handleAddRow = (e) => {
    e.preventDefault();

    let value = JSON.parse(PurposeRef.current.value).Name;
    let copy = FareStore.TariffCards[value];
    if (EditFare) {
      defaultTariffCard.Id = EditFare[0].Id;
      defaultTariffCard.DeploymentPurpose = EditFare[0].DeploymentPurpose;
    }
    copy.push(JSON.parse(JSON.stringify(defaultTariffCard)));
    console.log("asdfasdf", copy);
    setFareStore({
      ...FareStore,
      TariffCards: {
        [value]: copy,
      },
    });
  };

  const handleRemoveRow = (e) => {
    e.preventDefault();
    let removedItem = JSON.parse(JSON.stringify(FareStore.RemovedTariff));
    let key = JSON.parse(PurposeRef.current.value).Name;
    let copy = JSON.parse(JSON.stringify(FareStore.TariffCards[key]));
    let { name, dataset } = e.target;
    copy.forEach((x) => x.Id === dataset.id && removedItem.push(x));
    if (EditFare) {
      setFareStore({
        ...FareStore,
        RemovedTariff: removedItem,
      });
    }
    copy.splice(+name, 1);
    setFareStore({
      ...FareStore,
      RemovedTariff: removedItem,
      TariffCards: {
        [key]: copy,
      },
    });
    console.log("handleRemoveRow", name, copy, removedItem);
  };

  return (
    <>
      <div className="row">
        <div className="col">
          <h3 className="mb-0">Add/Edit Fare Policy</h3>
        </div>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            Vehicle Type:
            <select
              ref={PurposeRef}
              onChange={setInputValue}
              className="form-select w-auto d-inline-block ms-3"
              name="DeploymentPurpose"
              id="DeploymentPurpose"
            >
              <option value="">Select Vehicle Type</option>
              {!isEmpty(FareStore.TariffCards) &&
                FareStore.DeploymentPurposes.map((t, i) => {
                  return (
                    <option
                      key={i}
                      value={JSON.stringify(t)}
                      selected={
                        JSON.stringify(t) ===
                        JSON.stringify(
                          FareStore.TariffCards[
                            Object.keys(FareStore.TariffCards).map((x) => x)
                          ][0].DeploymentPurpose,
                        )
                      }
                    >
                      {t.Name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        <hr />
        {!isEmpty(FareStore.TariffCards) && (
          <>
            <h5>
              Select Distance Range:
              <button
                className="btn btn-sm btn-primary float-end"
                onClick={handleAddRow}
              >
                Add
              </button>
            </h5>
            <hr />
            {Object.keys(FareStore.TariffCards).map((v) => {
              return FareStore.TariffCards[v].map((x, i) => {
                return (
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      From:{" "}
                      <input
                        onChange={setInputValue}
                        defaultValue={x.FromKms}
                        className="form-control w-auto d-inline-block ms-3"
                        type="text"
                        data-index={i}
                        name="FromKms"
                        id="FromKms"
                        placeholder="KMS"
                      />
                    </div>
                    <div className="col-sm-3">
                      To:{" "}
                      <input
                        onChange={setInputValue}
                        defaultValue={x.ToKms}
                        className="form-control w-auto d-inline-block ms-3"
                        type="text"
                        data-index={i}
                        name="ToKms"
                        id="ToKms"
                        placeholder="KMS"
                      />
                    </div>
                    <div className="col-sm-3">
                      Fare:{" "}
                      <input
                        onChange={setInputValue}
                        defaultValue={x.PricePerKm}
                        className="form-control w-auto d-inline-block ms-3"
                        type="text"
                        data-index={i}
                        name="PricePerKm"
                        id="PricePerKm"
                        placeholder="Rs. per/KMS"
                      />
                    </div>
                    {i !== 0 && (
                      <div className="col-3">
                        <button
                          className="btn btn-sm btn-danger"
                          name={i}
                          data-Id={x.Id}
                          onClick={handleRemoveRow}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                );
              });
            })}
            <hr />
            <div className="row">
              <div className="col text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-3"
                  onClick={() => onChange(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default AddFarePolicy;
