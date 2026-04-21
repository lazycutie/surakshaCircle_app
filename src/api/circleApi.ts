import { axiosInstance } from "./axiosInstance";

export const createCircle = async (name: string) => {
  const res = await axiosInstance.post("/circle", { name });

  return res.data;
};

export const getCircleById = async (circleId: string) => {
  const res = await axiosInstance.get(`/circle/${circleId}`);

  return res.data;
};

export const joinCircle = async (inviteCode: string) => {
  const res = await axiosInstance.post("/circle/join", { inviteCode });

  return res.data;
};

export const getMyCircles = async () => {
  const res = await axiosInstance.get("/circle/mine");
  return res.data;
};

export const promoteMember = async (circleId: string, userId: string) => {
  const res = await axiosInstance.patch(
    `/circle/${circleId}/promote/${userId}`,
  );
  return res.data;
};

export const updateRelationship = async (
  circleId: string,
  userId: string,
  relationship: string,
) => {
  const res = await axiosInstance.patch(
    `/circle/${circleId}/relationship/${userId}`,
    { relationship },
  );

  return res.data;
};

export const removeMember = async (circleId: string, userId: string) => {
  const res = await axiosInstance.delete(
    `/circle/${circleId}/remove/${userId}`,
  );
  return res.data;
};

export const leaveCircle = async (circleId: string) => {
  const res = await axiosInstance.post(`/circle/${circleId}/leave`);
  return res.data;
};

export const deleteCircle = async (circleId: string) => {
  const res = await axiosInstance.delete(`/circle/${circleId}`);
  return res.data;
};
