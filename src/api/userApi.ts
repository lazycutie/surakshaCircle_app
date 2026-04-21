import { axiosInstance } from "./axiosInstance";

/*
GET logged-in user profile
GET /users/me
*/
export const getProfile = async () => {
  const res = await axiosInstance.get("/users/me");

  return res.data;
};

/*
UPDATE user profile
PUT /users/me
*/
export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
  email?: string;
  phone?: string;
  age?: number;
}) => {
  const res = await axiosInstance.put("/users/me", data);

  return res.data;
};

/*
CHANGE PASSWORD
PUT /users/change-password
*/
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await axiosInstance.put("/users/change-password", data);

  return res.data;
};

/*
UPLOAD PROFILE PICTURE
POST /users/profile-picture
*/
export const uploadProfilePicture = async (image: any) => {
  const formData = new FormData();

  formData.append("profilePicture", {
    uri: image.uri,
    name: "profile.jpg",
    type: "image/jpeg",
  } as any);

  const res = await axiosInstance.post("/users/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/*
SEARCH USERS
GET /users/search
*/
export const searchUsers = async (query: string) => {
  const res = await axiosInstance.get(`/users/search?q=${query}`);

  return res.data;
};

export const savePushToken = async (pushToken: string) => {
  const res = await axiosInstance.post("/users/save-push-token", {
    pushToken
  });
  return res.data;
};
