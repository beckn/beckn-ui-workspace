import * as yup from "yup";

export const getVehicleInfoSchema = () => {
  return yup
    .object()
    .shape({
      VehicleNumber: yup.string().required(),
      Make: yup.string().required(),
      NameOfModel: yup.string().required(),
      VehicleType: yup.string().required(),
      FuelType: yup.string().required(),
    })
    .required();
};
