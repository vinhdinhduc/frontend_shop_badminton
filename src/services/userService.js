import axios from "../setup/axios";

const registerUser = (data) => {
  return axios.post("/register", data);
};
const loginUser = (data) => {
  return axios.post("/login", data);
};

const getAllUserService = () => {
  return axios.get("/users/get-all-users");
};
export { registerUser, loginUser, getAllUserService };
