import axiosInstance from "./axios";

export const fetchSubjects = async () => {
  const response = await axiosInstance.get("/academics/subjects/");
  return response.data.results;
};
