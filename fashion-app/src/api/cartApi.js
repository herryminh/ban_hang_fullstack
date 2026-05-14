import axiosClient from './axiosClient';

const cartApi = {
    // 1. Thêm vào giỏ hàng
    // cartItem nên bao gồm cả userId nếu backend chưa tự lấy từ token
    addToCart: (cartItem, token) => {
        const url = '/cart';
        return axiosClient.post(url, cartItem, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // 2. Lấy giỏ hàng của tôi
    // Nếu chưa có auth middleware, ta truyền userId qua params
    getMyCart: (userId, token) => {
        const url = '/cart';
        return axiosClient.get(url, {
            params: { userId }, // Sẽ tạo ra url: /cart?userId=...
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // 3. Cập nhật số lượng (Tăng/Giảm)
    // cartId ở đây chính là chuỗi "productId-sku"
    // Trong cartApi.js
    updateQuantity: (cartId, quantity, token) => {
        // encodeURIComponent giúp mã hóa các ký tự đặc biệt trong ID sản phẩm
        const url = `/cart/${encodeURIComponent(cartId)}`;
        return axiosClient.put(
            url,
            { quantity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
    },

    // 4. Xóa 1 sản phẩm khỏi giỏ
    removeFromCart: (cartId, token) => {
        const url = `/cart/${cartId}`;
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // 5. Xóa sạch giỏ hàng
    clearCart: (userId, token) => {
        // Sửa lại đường dẫn cho khớp với Postman của bạn
        return axiosClient.delete(`/cart?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export default cartApi;
