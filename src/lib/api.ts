import axios, { type InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');

    if (token) {
        if (!config.headers) {
            config.headers = {} as InternalAxiosRequestConfig['headers'];
        }

        if (typeof (config.headers as any).set === 'function') {
            (config.headers as any).set('Authorization', `Bearer ${token}`);
        } else {
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
    }

    return config;
};

instance.interceptors.request.use(
    authRequestInterceptor,
    (error) => {
        return Promise.reject(error);
    }
)

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // if(error.response.status === 401) {
        //     //redirect
        //     //modal con el error
        // }
        return Promise.reject(error);
    }
)

export default instance;