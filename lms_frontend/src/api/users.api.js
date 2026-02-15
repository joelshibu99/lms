import axiosInstance from "./axios";

/* =========================
   FETCH USERS
========================= */
export const fetchCollegeUsers = async () => {
  const response = await axiosInstance.get("/accounts/users/");
  return response.data.results;
};

/* =========================
   UPDATE USER STATUS
========================= */
export const updateUserStatus = async (userId, data) => {
  const response = await axiosInstance.patch(
    `/accounts/users/${userId}/`,
    data
  );
  return response.data;
};
