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

export const patchBnbInfo = (tripId, bnbName, bnbInfo) => {
  return tripRequest.patch(`trip/${tripId}/bnbs.json`, {
    [bnbName]: bnbInfo,
  });
};

// const GOTO_API = "https://goto-api.vercel.app/api";
const GOTO_API = "http://localhost:3000/api";

export const getAvailableRooms = (bnbId, dates, bnbName) => {
  const apiUrl = GOTO_API + `/twstay/${bnbId}/rooms`;
  return axios.post(apiUrl, {
    bnbId,
    dates,
    bnbName,
  });
};
