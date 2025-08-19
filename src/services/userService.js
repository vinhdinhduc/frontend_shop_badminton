import axios from "../setup/axios";

const registerUser = (data) => {
  return axios.post("/register", data);
};
const loginUser = (data) => {
  return axios.post("/login", data);
};
export { registerUser, loginUser };
