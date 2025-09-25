import axios from "../setup/axios";

const getAllBrands = (params) => {
  return axios.get("/brand/get-all", { params });
};

const getBrandById = (id) => {
  return axios.post("/brand/get-all", id);
};
export { getAllBrands, getBrandById };
