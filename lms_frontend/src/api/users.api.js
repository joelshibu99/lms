import axiosInstance from "./axios";

export const fetchCollegeUsers = async () => {
  const response = await axiosInstance.get("/accounts/users/");
  return response.data.results;
};

export const updateUserStatus = async (userId, data) => {
  const response = await axiosInstance.patch(
    `/accounts/users/${userId}/`,
    data
  );
  return response.data;
};

export const createCollegeUser = async (data) => {
  const response = await axiosInstance.post(
    "/accounts/users/",
    data
  );
  return response.data;
};
export const updateCollegeUser = async (userId, data) => {
  const response = await axiosInstance.patch(
    `/accounts/users/${userId}/`,
    data
  );
  return response.data;
};
