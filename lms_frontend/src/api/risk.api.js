import axios from "./axios";

export const fetchTeacherRiskOverview = async () => {
  const res = await axios.get(
    "/analytics/teacher-risk-overview/"
  );
  return res.data;
};
