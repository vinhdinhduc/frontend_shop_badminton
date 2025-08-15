import axios from "axios";

// Tạo instance axios
const axiosClient = axios.create({
  baseURL: process.env.URL_API || "http://localhost:8080/api/v1",
  //   timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response) {
      console.error(
        "API Error:",
        error.response.data?.message || error.message
      );
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error("No response from server");
      return Promise.reject({ message: "No response from server" });
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosClient;
