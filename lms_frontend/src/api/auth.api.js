import axios from "./axios";

export const login = async (data) => {
  return axios.post("/accounts/login/", data);
};
