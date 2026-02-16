import axios from "./axios";

export const generateTeacherReport = async (studentId) => {
  const res = await axios.post("ai-reports/generate/", {
    student_id: studentId,
  });
  return res.data;
};
export const getTeacherReports = async () => {
  const res = await axios.get("ai-reports/teacher-reports/");
  return res.data;
};
