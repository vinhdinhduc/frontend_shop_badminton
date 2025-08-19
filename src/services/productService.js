import axios from "../setup/axios";

const createProduct = (data) => {
  return axios.post("/product/add", data);
};

export { createProduct };
