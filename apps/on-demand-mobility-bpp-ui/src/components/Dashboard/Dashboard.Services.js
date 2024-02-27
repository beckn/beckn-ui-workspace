import { getRequestData } from "../../core/apiClient";
import { UserFields } from "../../core/fieldsSet";

export const getUserSummaries = () => {
  let uPath = "user_summaries";
  let vPath = "vehicle_summaries";
  return getRequestData(uPath).then((res) => {
    return getRequestData(vPath).then((res2) => {
      return {
        UserSummaries: res.data.UserSummaries,
        VehicleSummaries: res2.data.VehicleSummaries,
      };
    });
  });
};

export const getUsers = () => {
  let uPath = "users";
  return getRequestData(uPath, UserFields);
};

export const getTrips = () => {
  let uPath = "trips";
  return getRequestData(uPath);
};

export const getUserShow = (id) => {
  let uPath = `users/show/${id}`;
  return getRequestData(uPath, UserFields);
};
