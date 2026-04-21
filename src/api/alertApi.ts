import { axiosInstance } from "./axiosInstance";

/*
|--------------------------------------------------------------------------
| CREATE ALERT
|--------------------------------------------------------------------------
| Sends SOS alert to backend
| Backend then sends socket notification to contacts
|--------------------------------------------------------------------------
*/
export const createAlert = async (data: {
  latitude: number;
  longitude: number;
  alertType: "manual" | "shake" | "voice";
  circleId?: string;
}) => {
  const res = await axiosInstance.post("/alerts", data);

  return res.data;
};

/*
|--------------------------------------------------------------------------
| GET ALERTS FROM ME
|--------------------------------------------------------------------------
| Fetch alerts triggered by the logged-in user
|--------------------------------------------------------------------------
*/
export const getMyAlerts = async () => {
  const res = await axiosInstance.get("/alerts");

  return res.data;
};

/*
|--------------------------------------------------------------------------
| GET ALERT DETAILS
|--------------------------------------------------------------------------
| Fetch a specific alert
|--------------------------------------------------------------------------
*/
export const getAlertById = async (alertId: string) => {
  const res = await axiosInstance.get(`/alerts/${alertId}`);

  return res.data;
};

/*
|--------------------------------------------------------------------------
| RESOLVE ALERT
|--------------------------------------------------------------------------
| Mark alert as resolved
|--------------------------------------------------------------------------
*/
export const resolveAlert = async (alertId: string) => {
  const res = await axiosInstance.patch(`/alerts/${alertId}/resolve`);

  return res.data;
};

/*
|--------------------------------------------------------------------------
| DELETE ALERT
|--------------------------------------------------------------------------
*/
export const deleteAlert = async (alertId: string) => {
  const res = await axiosInstance.delete(`/alerts/${alertId}`);

  return res.data;
};

/*
|--------------------------------------------------------------------------
| GET RECEIVED ALERTS
|--------------------------------------------------------------------------
| Fetch alerts sent by other members in circles
|--------------------------------------------------------------------------
*/

export const getReceivedAlerts = async () => {
  const res = await axiosInstance.get("/alerts/received");

  return res.data;
};
