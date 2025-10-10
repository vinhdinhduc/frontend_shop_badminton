import axios from "../setup/axios";

const getNotificationService = (params) => {
  return axios.get("/notifications/get-notification", { params });
};

// Lấy số lượng chưa đọc
const getUnreadCountService = () => {
  return axios.get("/notifications/unread-count");
};

// Đánh dấu tất cả đã đọc
const markAllAsReadService = () => {
  return axios.put("/notifications/mark-all-read");
};

// Đánh dấu một thông báo đã đọc
const markAsReadService = (id) => {
  return axios.put(`/notifications/${id}/read`);
};

// Xóa một thông báo
const deleteNotificationService = (id) => {
  return axios.delete(`/notifications/${id}`);
};

// Xóa tất cả thông báo đã đọc
const deleteAllReadService = () => {
  return axios.delete("/notifications/read/all");
};

export {
  getNotificationService,
  getUnreadCountService,
  markAllAsReadService,
  markAsReadService,
  deleteNotificationService,
  deleteAllReadService,
};
