import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URLS = {
  auth: `${API_BASE_URL}auth`,
  admin: `${API_BASE_URL}admin`,
  employee: `${API_BASE_URL}employee`,
  manager: `${API_BASE_URL}manager`,
};

const createApiClient = (baseURL) => {
  const client = axios.create({ baseURL });

  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return client;
};

export const authApiClient = createApiClient(BASE_URLS.auth);
export const adminApiClient = createApiClient(BASE_URLS.admin);
export const employeeApiClient = createApiClient(BASE_URLS.employee);
export const managerApiClient = createApiClient(BASE_URLS.manager);
