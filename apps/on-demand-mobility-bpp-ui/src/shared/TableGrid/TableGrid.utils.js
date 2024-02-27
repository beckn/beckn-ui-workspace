export const getFilteredData = (data = [], tableType, Status) => {
  let filteredData = [];
  if (tableType === "agent") {
    filteredData = data.filter((x) =>
      Status ? x.Approved === Status && x.Staff === "Y" : x.Staff === "Y",
    );
    return filteredData;
  }
  if (tableType === "driver") {
    filteredData = data.filter((x) =>
      Status ? x.Approved === Status && x.Staff === "N" : x.Staff === "N",
    );
    return filteredData;
  }

  return filteredData;
};
