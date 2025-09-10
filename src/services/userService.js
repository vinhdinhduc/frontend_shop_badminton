import axios from "../setup/axios";

const registerUser = (data) => {
  return axios.post("/register", data);
};
const loginUser = (data) => {
  return axios.post("/login", data);
};

const getAllUserService = (query = {}) => {
  return axios.get("/users/get-all-users", { params: query });
};

const createNewUser = (data) => {
  return axios.post("/users/create-user", data);
};
const updateUser = (id, data) => {
  return axios.put(`/users/update-user/${id}`, data);
};
const softDeleteUser = (id) => {
  return axios.delete("/users/soft-delete-user", { data: { id } });
};
const hardDeleteUser = (id) => {
  return axios.delete("/users/hard-delete-user", { data: { id } });
};
const restoreUser = (id) => {
  return axios.patch("/users/restore-user", { id });
};
const getUserSoftDeleted = (params) => {
  return axios.get("/users/get-user-soft-deleted", { params });
};
export {
  registerUser,
  loginUser,
  getAllUserService,
  createNewUser,
  updateUser,
  softDeleteUser,
  hardDeleteUser,
  restoreUser,
  getUserSoftDeleted,
};
