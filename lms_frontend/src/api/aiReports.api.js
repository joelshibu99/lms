import axios from "./axios";

export const generateTeacherReport = async (studentId) => {
  const res = await axios.post("ai-reports/generate/", {
    student_id: studentId,
  });
  return res.data;
};
