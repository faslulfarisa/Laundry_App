import axios from "axios"
import { USER_BASE_URL, ORDER_BASE_URL,ADMIN_BASE_URL } from "./constants";

const userAxiosInstance = axios.create({
    baseURL: USER_BASE_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Axios instance for order-related requests
const orderAxiosInstance = axios.create({
    baseURL: ORDER_BASE_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});

const adminAxiosInstance = axios.create({
    baseURL: ADMIN_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptors for user Axios instance
userAxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptors for order Axios instance
orderAxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Interceptors for admin Axios instance
adminAxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        // console.log("Stored Token:", localStorage.getItem("token"));

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// export default userAxiosInstance;
export { userAxiosInstance, orderAxiosInstance,adminAxiosInstance};
