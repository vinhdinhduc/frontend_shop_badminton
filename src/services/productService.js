import axios from "../setup/axios";

const createProduct = (data) => {
  return axios.post("/product/add", data);
};

const getAllProduct = () => {
  return axios.get("/product/get-all");
};
const getProductById = (id) => {
  return axios.get(`/product/get-racket-by-id/${id}`);
};
const updateProductService = (productData) => {
  return axios.put("/product/update", productData);
};
const softDelete = (id) => {
  return axios.delete(`/product/soft-delete/${id}`);
};
const hardDelete = (id) => {
  return axios.delete(`/product/hard-delete/${id}`);
};
const getSoftDeletedList = () => {
  return axios.get("/product/get-deleted");
};
const restoreProductService = (id) => {
  return axios.patch(`/product/restore/${id}`);
};
export {
  createProduct,
  getAllProduct,
  updateProductService,
  getProductById,
  softDelete,
  getSoftDeletedList,
  hardDelete,
  restoreProductService,
};
