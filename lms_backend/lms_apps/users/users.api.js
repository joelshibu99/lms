import api from "../../api/axios";

export const fetchCollegeUsers = () =>
  api.get("/college-admin/users/");
