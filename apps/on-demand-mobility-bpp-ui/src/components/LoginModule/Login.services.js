import { getRequestData, postRequestData } from "../../core/apiClient";
import { setApiKey, setUser } from "../../core/common.functions";
import { UserFields } from "../../core/fieldsSet";

export const getCompanies = (path, fields) => {
  return getRequestData(path, fields);
};

export const getRoles = (path, fields) => {
  return getRequestData(path, fields);
};

export const userAction = async (path, data, fields) => {
  const logRes = await postRequestData(path, data, fields);
  setApiKey(logRes.data.User);
  let userUrl = `users/show/${logRes.data.User.Id}`;
  let fieldset = `{"User":["Name","DateOfBirth","Id","AddressLine1","AddressLine2","AddressLine3","CityId","FirstName","LastName","PhoneNumber","PinCodeId","Verified"],"DriverDocument":["Id","Document","ImageUrl","DocumentNumber","Verified"]}`;
  const getUser = await getRequestData(userUrl, UserFields);
  console.log({ getUser });

  // console.log("userAction", getUser, logRes);
  setUser(getUser.data.User);
  if (data.User.UserRole) {
    let roleUrl = "user_roles/save";
    let roleData = {
      UserRole: {
        UserId: logRes.data.User.Id,
        Role: data.User.UserRole,
      },
    };
    return await postRequestData(roleUrl, roleData);
  } else {
    return logRes.data.User;
  }
};

export const userLogin = (path, data, fields) => {
  return postRequestData(path, data, fields);
};

export const userLogout = (path, fields) => {
  return getRequestData(path, fields);
};
