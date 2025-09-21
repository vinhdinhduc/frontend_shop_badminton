import axios from "../setup/axios";

const getAllBrands = (query) => {
  return axios.get("/brand/get-all", { query });
};

const getBrandById = (id) => {
  return axios.post("/brand/get-all", id);
};
export { getAllBrands, getBrandById };
