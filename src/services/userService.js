import axios from "../setup/axios";

const registerUser = (data) => {
  return axios.post("/register", data);
};

export { registerUser };
