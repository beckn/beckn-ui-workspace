import React, { useEffect, useState } from "react";
import { VehicleType } from "../../shared/constant";
import { getFarePolicies } from "./FarePolicy.Services";
import "./FarePolicy.scss";

export const FarePolicy = ({ FareList, onUpdate, onChange }) => {
  const [store, setStore] = useState({
    TariffCards: [],
    Type: VehicleType,
  });
  useEffect(() => {
    getFareList();
  }, [FareList]);

  const getFareList = () => {
    getFarePolicies().then((res) => {
      let FareCards = {};
      res.data.TariffCards.forEach((v, i) => {
        if (FareCards[v.DeploymentPurpose.Name]) {
          FareCards[v.DeploymentPurpose.Name].push(v);
        } else {
          FareCards[v.DeploymentPurpose.Name] = [v];
        }
      });
      setStore({
        ...store,
        TariffCards: FareCards,
      });
      onUpdate(FareCards);
    });
  };
  return (
    store.TariffCards &&
    Object.keys(store.TariffCards).map((card) => {
      return (
        <>
          <div className="row mb-3">
            <div className="col-sm card border-0" type="button">
              <div className="border bg-primary border-primary p-4 rounded-3 position-relative">
                <div className="row-action">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={(e) => onChange(e, store.TariffCards[card])}
                  >
                    edit
                  </button>
                </div>
                <h5>
                  Vehicle Type :{" "}
                  {store.TariffCards[card][0].DeploymentPurpose.Name}
                </h5>
                Tariff Card:
                {store.TariffCards[card].map((v) => {
                  return (
                    <h6>
                      Rs. {v.PricePerKm} / Km for ( from {v.FromKms} Kms to{" "}
                      {v.ToKms} Kms)
                    </h6>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      );
    })
  );
};

export default FarePolicy;
