import axiosClient from './axiosClient';

const authApi = {
    login(data) {
        return axiosClient.post('/user/login', data);
    },

    register(formData) {
        return axiosClient.post('/user/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    getUsers() {
        return axiosClient.get('/user');
    },

    deleteUser(id) {
        return axiosClient.delete(`/user/${id}`);
    },

    getUserById(id) {
        return axiosClient.get(`/user/get/${id}`);
    },

    updateUser(id, formData) {
        return axiosClient.put(`/user/${id}`, formData);
    },
};

export default authApi;
