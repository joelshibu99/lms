import axios from "./axios";

export const fetchTeacherMarks = async () => {
  const res = await axios.get("academics/marks/");
  return res.data;
};

export const createMark = async (data) => {
  const res = await axios.post("academics/marks/", data);
  return res.data;
};
export const updateMark = async (id, data) => {
  const res = await axios.patch(`academics/marks/${id}/`, data);
  return res.data;
};