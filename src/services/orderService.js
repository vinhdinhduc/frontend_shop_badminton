import axios from "../setup/axios";

const getAllOrder = (query) => {
  return axios.get("/order/get-all", { params: query });
};

const getOrderById = (id) => {
  return axios.get(`/order/get-by-id/${id}`);
};

const getOrderByUserId = (userId) => {
  return axios.get(`/order/get-order-by-user/${userId}`);
};

const createOrder = (dataOrder) => {
  return axios.post("/order/create", dataOrder);
};

const getProvince = () => {
  return axios.get("https://provinces.open-api.vn/api/p/");
};
const getDistricts = (selectedProvince) => {
  return axios.get(
    `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
  );
};

const getWards = (selectedDistrict) => {
  return axios.get(
    `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
  );
};

export {
  getAllOrder,
  getOrderById,
  getOrderByUserId,
  getProvince,
  getDistricts,
  getWards,
  createOrder,
};
