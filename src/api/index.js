import axios from "axios";

// const GOTO_API = "https://goto-api.vercel.app/api/";
// const GOTO_API = "http://localhost:3000/api/";
const GOTO_API =
  "http://ec2-52-194-232-161.ap-northeast-1.compute.amazonaws.com/api/";
const tripAxios = axios.create({ baseURL: GOTO_API });

export const createTrip = (tripName, availableDates) => {
  return tripAxios.post("trip", {
    tripName,
    availableDates,
  });
};

export const getTrip = (tripId) => {
  return tripAxios.get(`trip/${tripId}`);
};

export const addNewMember = (tripId, username) => {
  return tripAxios.post(`trip/${tripId}/members`, {
    username,
  });
};

export const updateMyVote = (tripId, userName, myVote) => {
  return tripAxios.patch(`trip/${tripId}/members/${userName}`, {
    datesVote: myVote,
  });
};

export const addNewBnb = (tripId, bnbId, dates) => {
  return tripAxios.post(`trip/${tripId}/bnbs`, {
    bnbId,
    dates,
  });
};
