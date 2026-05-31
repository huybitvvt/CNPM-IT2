import axios from "axios";
import { API_BASE_URL } from "./constant";
import { message } from "antd";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.skipGlobalErrorToast) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      message.destroy()
      message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else if (error.response?.status === 403) {
      message.error("Bạn không có quyền thực hiện thao tác này.");
    } else if (error.response?.status === 404) {
      message.error("Không tìm thấy tài nguyên yêu cầu.");
    } else if (error.response?.status >= 500) {
      message.error("Máy chủ đang gặp lỗi. Vui lòng thử lại sau.");
    }
    return Promise.reject(error);
  }
);

export default api;
