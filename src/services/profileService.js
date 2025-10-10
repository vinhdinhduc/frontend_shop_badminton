import axios from "../setup/axios";

const getProfileService = (id) => {
  return axios.get("profile/profile-get", id);
};
const getUserAddressService = (id) => {
  return axios.get("/profile/get-addresses", id);
};
const updateProfileService = (dataProfile) => {
  return axios.put("/profile/profile-update", dataProfile);
};
const updateAvatarService = (avatarFile) => {
  return axios.post("/profile/avatar", avatarFile, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const changePasswordService = (currentPassword, newPassword) => {
  return axios.put("/profile/change-password", currentPassword, newPassword);
};
const addAddressService = (data) => {
  return axios.post("/profile/create-addresses", data);
};
const updateAddressService = (addressId, data) => {
  return axios.put(`/profile/addresses/${addressId}`, data);
};
const deleteAddressService = (addressId) => {
  return axios.delete(`/profile/delete-addresses/${addressId}`);
};
const setDefaultAddressService = (params) => {
  return axios.patch("/profile/addresses/:addressId/set-default", { params });
};

export {
  getProfileService,
  setDefaultAddressService,
  deleteAddressService,
  updateAddressService,
  addAddressService,
  changePasswordService,
  updateAvatarService,
  updateProfileService,
  getUserAddressService,
};
