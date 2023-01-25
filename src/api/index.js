import axios from "axios";

const FIREBASE_URL =
  "https://goto-travel-3e748-default-rtdb.asia-southeast1.firebasedatabase.app/";

const tripRequest = axios.create({ baseURL: FIREBASE_URL });

// axios 會自動轉換 date 成 UTC string
const createTrip = (tripName, availableDates) => {
  return tripRequest.post("trip.json", {
    tripName,
    availableDates,
  });
};

const getTrip = (tripId) => {
  return tripRequest.get(`trip/${tripId}.json`);
};

export { createTrip, getTrip };
