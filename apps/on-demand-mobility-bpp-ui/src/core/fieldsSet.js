export const UserFields = `{"User":["Name","LongName", "DateOfBirth","Id","AddressLine1","AddressLine2","AddressLine3","CityId","FirstName","LastName","PhoneNumber","PinCodeId","Approved","Staff","CompanyId","DateOfJoining"],"DriverDocument":["Id","Document","ImageUrl","DocumentNumber","VerificationStatus"],"UserRole":["RoleId"]}`;
export const VehicleFields = `{"Vehicles":["Id","Tags","VehicleNumber","Approved","UserId"],"VehicleDocument":["Id","ValidFrom","ValidTo","DocumentNumber","Document","ImageUrl","VerificationStatus"]}`;
export const DeploymentPurposesFields = `{"DeploymentPurpose":["Name","Id"]}`;
export const TariffCardFields = `{"TariffCard":["Id","FromKms","ToKms","PricePerKm","DeploymentPurposeId"]}`;
export const TripIdFields = `{"Trips":[], "TripStop":["Name","Id","DistanceFromLastStop","Lat","Lng"] }`;
