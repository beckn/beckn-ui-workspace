import * as yup from "yup";

const dateBefore18yrs = new Date(
  new Date().setFullYear(new Date().getFullYear() - 18)
);

export const getPersonalInfoSchema = () => {
  return yup
    .object()
    .shape({
      DateOfBirth: yup
        .date()
        .max(dateBefore18yrs, "Age should be greater than 18")
        .nullable(),
      Name: yup
        .string()
        .required("Email is a required field")
        .email("Invalid Email Address"),
      FirstName: yup.string().required().min(2).max(12),
      LastName: yup.string().required().min(2).max(12),
      PhoneNumber: yup
        .string()
        .required()
        .matches(/^(\+)?\d+$/, "Phone number is not valid")
        .min(10)
        .max(15),
    })
    .required();
};

export const getAddressInfoSchema = ({ PinCodes, CityNames, StateNames }) => {
  return yup
    .object()
    .shape({
      AddressLine1: yup.string().required(),
      AddressLine2: yup.string().required(),
      AddressLine3: yup.string().required(),
      PinCode: yup
        .object()
        .shape({
          PinCode: yup
            .string()
            .oneOf(PinCodes, "Choose from list")
            .required("Pincode is a required field"),
        })
        .required(),
      City: yup
        .object()
        .shape({
          Name: yup
            .string()
            .oneOf(CityNames, "Choose from list")
            .required("City Name is a required field"),
          State: yup.object().shape({
            Name: yup
              .string()
              .oneOf(StateNames, "Choose from list")
              .required("State Name is a required field"),
          }),
        })
        .required(),
    })
    .required();
};
