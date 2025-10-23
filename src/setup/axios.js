import axios from "axios";

// Tạo instance axios
const axiosClient = axios.create({
  baseURL:
    process.env.REACT_APP_URL_API ||
    "https://0f7469w4-8080.asse.devtunnels.ms/api/v1",
  //   timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request
axiosClient.interceptors.request.use(
  (config) => {
    const userInfoStr = localStorage.getItem("userInfo");

    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        console.log("userInfo from localStorage:", userInfo);

        const token = userInfo?.data?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
        // Xóa dữ liệu lỗi
        localStorage.removeItem("userInfo");
      }
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
