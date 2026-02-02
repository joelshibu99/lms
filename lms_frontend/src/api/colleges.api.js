import axiosInstance from "./axios";

export const fetchColleges = async () => {
  const response = await axiosInstance.get("/colleges/colleges/");
  return response.data.results; // ✅ IMPORTANT
};
