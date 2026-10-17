import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const options = {
  baseURL,
  withCredentials: true,
  timeout: 120000, // 2 minutes timeout
};

const API = axios.create(options);

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      window.dispatchEvent(new CustomEvent('tokenChanged'));
    }
    return response;
  },
  async (error) => {
    const response = error.response || {};
    const data = response.data || {};
    const status = response.status || 500;

    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const customError: CustomError = {
        ...error,
        message: "Request timed out. The server may be starting up (this can take up to 2 minutes on first request). Please try again.",
        errorCode: "TIMEOUT_ERROR",
      };
      return Promise.reject(customError);
    }

    if (status === 401) {
      localStorage.removeItem('authToken');
      window.dispatchEvent(new CustomEvent('tokenChanged'));
      
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes('/sign-in') || currentPath.includes('/sign-up') || currentPath === '/';
      
      if (!isAuthPage && !window.location.href.includes('redirecting')) {
        window.location.replace("/");
      }
    }

    const customError: CustomError = {
      ...error,
      message: data?.message || error.message || "An error occurred",
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
