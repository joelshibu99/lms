import axios from "./axios";

export const fetchStudentRisk = async (studentId) => {
  const res = await axios.get(
    `/analytics/student-risk/${studentId}/`
  );
  return res.data;
};
