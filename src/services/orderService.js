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

export { getAllOrder, getOrderById, getOrderByUserId };
