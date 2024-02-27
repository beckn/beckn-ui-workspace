import {
  getRequestData,
  postRequestData,
  updateLocation,
} from "../../../../core/apiClient";
import { eventCode } from "./utils";
import { TripIdFields } from "../../../../core/fieldsSet";
import { getCookie } from "../../../../core/CookiesHandler";
import { setActiveRide } from "../../../../core/common.functions";
import { round } from "../../utils/utils";

// export getDriverOnline = ()
export const getUserVehicles = async (UserId) => {
  let userUrl = `users/show/${UserId}/authorized_drivers`;
  const vehiclesData = await getRequestData(userUrl);
  return vehiclesData.data;
};
export const getUserVehicles1 = async (UserId) => {
  let userUrl = `users/show/${UserId}/vehicles`;
  const vehiclesData = await getRequestData(userUrl);
  return vehiclesData.data;
};
export const getDriverOnline = async (UserId, position) => {
  let path = "authorized_drivers/login";
  const vehicleData = await getUserVehicles1(UserId);
  const assignedVehicle = vehicleData.Vehicles.filter(
    (vehicle) => vehicle.Approved === "Y",
  );
  console.log({ assignedVehicle });
  const payload = {
    AuthorizedDriver: {
      Vehicle: {
        Id: assignedVehicle[0].Id,
      },
      Driver: {
        Id: UserId,
      },
    },
  };
  return postRequestData(path, payload).then((res) => res.data.DriverLogin);
};

export const getTrips = async (id, location) => {
  const assignedTripPath = `/trips/search?q=DRIVER_LOGIN_ID:${id}+AND+STATUS:Confirmed&maxRecords=1`;
  const newPath = `/trips/next/1`;
  const path = `driver_logins/updateLocation/${id}`;
  const syncDriveLocation = await updateDriverLocation(path, location);
  const tripsData1 = await getRequestData(newPath, TripIdFields, location).then(
    (res) => res.data.Trips,
  );
  if (tripsData1 && tripsData1?.length > 0) {
    localStorage.setItem("destId", tripsData1[0].BapId);
  }

  return tripsData1;
};
const bppId =
  "becknify.humbhionline.in.mobility.BPP/beckn_open/app1-succinct-in";
const bapId = "mobilityreferencebap.becknprotocol.io";
const getDestinationId = (code) => {
  if (code === "mbth_login" || code === "mbth_avbl_online") {
    return bppId;
  }
  const destId = localStorage.getItem("destId") || undefined;
  console.log("destId", destId);
  return destId || bapId;
};
export const triggerEvent = async (event_code) => {
  const experience_id = localStorage.getItem("expId");
  if (experience_id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const body = JSON.stringify({
      experienceId: experience_id,
      eventCode: event_code,
      eventAction: event_code,
      eventSourceId: bppId,
      eventDestinationId: getDestinationId(event_code),
      payload: "bpp action",
      eventStart_ts: new Date().toISOString(),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body,
      redirect: "follow",
    };
    const delayedCall = () => {
      try {
        const res = fetch(
          "https://api.eventcollector.becknprotocol.io/v2/event",
          requestOptions,
        )
          .then((response) => response.text())
          .then((result) => console.log("expId", result))
          .catch((error) => console.log("error", error));
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(delayedCall, 1000);
  } else {
    return undefined;
  }
};
export const acceptRide = (tripId, experienceId) => {
  const path = `trips/accept/${tripId}`;
  return getRequestData(path);
};

export const rejectRide = (tripId, experienceId) => {
  const path = `trips/reject/${tripId}`;
  return getRequestData(path);
};

export const startRide = (tripId) => {
  const path = `trips/start/${tripId}`;
  return getRequestData(path);
};
export const endRide = (tripId) => {
  const path = `trips/end/${tripId}`;
  return getRequestData(path);
};

export const updateDriverLocation = async (driverId, location) => {
  const path = `driver_logins/updateLocation/${driverId}`;
  return getRequestData(path, undefined, location);
};

export const getTripStatus = async (trip, location) => {
  const path = `trips/show/${trip.Id}`;
  const res = await getRequestData(path).then((res) => res.data.Trip);
  setActiveRide({
    res,
    location,
    distance: trip?.TripStops[1]?.DistanceFromLastStop,
  });
  return res;
};
