import axios from "axios";



export const axiosInstance = axios.create({
    baseURL: "http://18.220.70.231:8081/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})


export function setAuthorizationToken(token: string | null) {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("jwt", token);
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
        localStorage.removeItem("jwt");
    }
}

axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Request config:', {
            url: config.url,
            headers: config.headers,
            withCredentials: config.withCredentials
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.data);
        return Promise.reject(error);
    }
);