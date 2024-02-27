import { getRequestData, postRequestData } from "../../core/apiClient";
import { TariffCardFields } from "../../core/fieldsSet";

export const getFarePolicies = () => {
  let path = `tariff_cards`;
  return getRequestData(path, TariffCardFields);
};

export const saveTariffCard = (data) => {
  let path = `tariff_cards/save/`;
  return postRequestData(path, data);
};

export const removedFarePolicies = (id) => {
  let path = `tariff_cards/destroy/${id}`;
  return getRequestData(path, TariffCardFields);
};
