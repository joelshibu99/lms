import axiosInstance from "./axios";

export const fetchStudentMarks = async () => {
  const response = await axiosInstance.get("/academics/student-history/");
  return response.data.results;
};
