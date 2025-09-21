import axios from "../setup/axios";

const addToCart = (cartData) => {
  return axios.post("/cart/add-to-cart", cartData);
};

const getCarts = (query) => {
  return axios.get("/cart/get-cart", { params: query });
};

const updateCartItem = (itemId, quantity) => {
  return axios.put(`/cart/update-cart-item/${itemId}`, { quantity });
};
const removeFromCart = (itemId) => {
  return axios.delete(`/cart/remove-from-cart/${itemId}`);
};

const clearCart = (userData) => {
  return axios.delete(`/cart/clear-cart`, { data: userData });
};
const getCartCount = (params) => {
  return axios.delete(`/cart/get-count`, { params });
};

const mergeCart = (mergeData) => {
  return axios.delete(`/cart/merge`, mergeData);
};
export {
  addToCart,
  getCarts,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
  mergeCart,
};
