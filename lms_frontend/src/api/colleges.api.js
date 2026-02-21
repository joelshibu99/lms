import axiosInstance from "./axios";

export const fetchColleges = async () => {
  const response = await axiosInstance.get("/colleges/colleges/");
  return response.data.results || response.data;
};

export const createCollege = async (data) => {
  const response = await axiosInstance.post(
    "/colleges/colleges/",
    data
  );
  return response.data;
};

export const updateCollegeStatus = async (id, data) => {
  const response = await axiosInstance.patch(
    `/colleges/colleges/${id}/`,
    data
  );
  return response.data;
};