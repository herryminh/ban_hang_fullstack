import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: false,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // console.log('Token sent:', localStorage.getItem('token'));

        // Nếu gửi FormData → KHÔNG đặt Content-Type
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
            delete config.headers.common?.['Content-Type'];
        } else {
            // Chỉ đặt JSON khi data thật sự là object thuần
            if (typeof config.data === 'object' && config.data !== null && !(config.data instanceof Blob)) {
                config.headers['Content-Type'] = 'application/json';
            }
        }

        return config;
    },
    (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
);

export default axiosClient;
