import { getRequestData, getUser, postRequestData } from "../../core/apiClient";

export const uploadFile = (path, data, fields, isUserUpdate) => {
  return postRequestData(path, data, fields).then((res) => {
    isUserUpdate && getUser(res.data.DriverDocument.Driver.Id, "driver");
    return res;
  });
};

export const getAutoCompleteValues = (searchGroup, val, section) => {
  return getRequestData(
    `${section ? section : "user"}/${searchGroup}/search?q=${val}`,
  );
};

export const getDocumentSave = (path, data, fields) => {
  return postRequestData(path, data, fields);
};
