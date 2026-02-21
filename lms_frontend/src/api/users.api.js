import axiosInstance from "./axios";

/**
 * 🔹 Fetch users
 * SYSTEM_ADMIN → All users
 * COLLEGE_ADMIN → College users
 */
export const fetchUsers = async () => {
  const response = await axiosInstance.get("/accounts/users/");
  return response.data.results || response.data;
};

/**
 * 🔹 Update user (status, role, etc.)
 */
export const updateUser = async (userId, data) => {
  const response = await axiosInstance.patch(
    `/accounts/users/${userId}/`,
    data
  );
  return response.data;
};

/**
 * 🔹 Create user
 */
export const createUser = async (data) => {
  const response = await axiosInstance.post(
    "/accounts/users/",
    data
  );
  return response.data;
};