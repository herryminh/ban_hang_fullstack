import axiosClient from './axiosClient';

const productApi = {
    // PRODUCT ------------------------
    getProducts() {
        return axiosClient.get('/product');
    },

    getBySlug(slug) {
        return axiosClient.get(`/product/${slug}`);
    },

    createProduct(formData) {
        return axiosClient.post('/product/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    updateProduct(id, formData) {
        return axiosClient.put(`/product/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteProduct(id) {
        return axiosClient.delete(`/product/${id}`);
    },

    // VARIANT ------------------------
    createVariant(formData) {
        return axiosClient.post('/variants/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    updateVariant(id, formData) {
        return axiosClient.put(`/variants/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteVariant(id) {
        return axiosClient.delete(`/variants/${id}`);
    },
};

export default productApi;
