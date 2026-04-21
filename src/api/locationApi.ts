import { axiosInstance } from "./axiosInstance";

/*
------------------------------------------------
SEND LIVE LOCATION
------------------------------------------------
*/
export const sendLiveLocation = async (data: {
  latitude: number;
  longitude: number;
  alertId?: string;
}) => {
  const res = await axiosInstance.post("/alerts/live-location", data);

  return res.data;
};

/*
------------------------------------------------
GET CIRCLE MEMBERS LOCATION
------------------------------------------------
*/
export const getCircleMembersLocation = async (circleId: string) => {
  const res = await axiosInstance.get(`/alerts/${circleId}/members-location`);

  return res.data;
};
