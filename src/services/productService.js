import axios from "../setup/axios";

const createProduct = (data) => {
  return axios.post("/product/add", data);
};

const getAllProduct = () => {
  return axios.get("/product/get-all");
};
export { createProduct, getAllProduct };
