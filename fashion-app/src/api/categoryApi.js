import axiosClient from './axiosClient';

const categoryApi = {
    // 1️⃣ Lấy tất cả category
    getCategories() {
        return axiosClient.get('/category');
    },

    // 2️⃣ Tạo category
    createCategory(data) {
        // data = { name: 'Quần áo' }
        return axiosClient.post('/category', data);
    },

    // 3️⃣ Cập nhật category
    updateCategory(id, data) {
        // data = { name: 'Giày dép' }
        return axiosClient.put(`/category/${id}`, data);
    },

    // 4️⃣ Xoá category
    deleteCategory(id) {
        return axiosClient.delete(`/category/${id}`);
    },

    // 5️⃣ Lấy category theo slug (nếu bạn có route)
    getBySlug(slug) {
        return axiosClient.get(`/category/slug/${slug}`);
    },
};

export default categoryApi;
