import { axiosInstance } from "./axiosInstance";

export const loginUser = async (data: {
  identifier: string;
  password: string;
}) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data: {
  name: string;
  email?: string;
  phone?: string;
  username: string;
  password: string;
}) => {
  const res = await axiosInstance.post("/auth/register", data);

  return res.data;
};
