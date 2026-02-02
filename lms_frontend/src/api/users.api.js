import axiosInstance from "./axios";

export const fetchCollegeUsers = async () => {
  const response = await axiosInstance.get("/accounts/users/");
  return response.data.results;
};
