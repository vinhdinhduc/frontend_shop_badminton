import axios from "../setup/axios";

const getAllBrands = (params) => {
  return axios.get("/brand/get-all", { params });
};

const getBrandById = (id) => {
  return axios.post("/brand/get-all", id);
};

const createBrand = (dataBrand) => {
  return axios.post("/brand/create", dataBrand);
};
const updateBrand = (id, dataUpdate) => {
  return axios.put(`/brand/update-brand/${id}`, dataUpdate);
};

const deleteBrand = (id) => {
  return axios.delete(`/brand/delete-brand/${id}`);
};
export { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand };
