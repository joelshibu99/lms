import axiosInstance from "./axios";

export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/accounts/login/", {
    email,
    password,
  });
  return response.data;
};
