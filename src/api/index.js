import axios from "axios";

const FIREBASE_URL =
  "https://goto-travel-3e748-default-rtdb.asia-southeast1.firebasedatabase.app/";

const tripRequest = axios.create({ baseURL: FIREBASE_URL });

export const createTrip = (tripName, availableDates) => {
  return tripRequest.post("trip.json", {
    tripName,
    availableDates,
  });
};

export const getTrip = (tripId) => {
  return tripRequest.get(`trip/${tripId}.json`);
};

export const patchNewMember = (tripId, userName, availableDates) => {
  const datesVote = {};
  availableDates.forEach((date) => {
    datesVote[date] = "";
  });
  return tripRequest.patch(`trip/${tripId}/members.json`, {
    [userName]: { datesVote },
  });
};

export const patchMyVote = (tripId, userName, myVote) => {
  return tripRequest.patch(`trip/${tripId}/members/${userName}.json`, {
    datesVote: myVote,
  });
};

const GOTO_API = "https://goto-api.vercel.app/api";
const TWSTAY_CRAWLER_API = GOTO_API + "/twstay";

export const getAvailableRoom = (bnb_url, date) => {
  return axios.post(TWSTAY_CRAWLER_API, {
    bnb_url,
    date,
  });
};
