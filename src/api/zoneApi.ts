import { axiosInstance } from "./axiosInstance";

/*
CREATE ZONE
POST /zones
*/
export const createZone = async (data: {
  circleId: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}) => {
  const res = await axiosInstance.post("/zones", data);

  return res.data;
};

/*
GET ZONES FOR A CIRCLE
GET /zones/:circleId
*/
export const getZones = async (circleId: string) => {
  const res = await axiosInstance.get(`/zones/${circleId}`);

  return res.data;
};

/*
UPDATE ZONE
PATCH /zones/:id
*/
export const updateZone = async (
  zoneId: string,
  data: {
    name?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  },
) => {
  const res = await axiosInstance.patch(`/zones/${zoneId}`, data);

  return res.data;
};

/*
DELETE ZONE
DELETE /zones/:id
*/
export const deleteZone = async (zoneId: string) => {
  const res = await axiosInstance.delete(`/zones/${zoneId}`);

  return res.data;
};
