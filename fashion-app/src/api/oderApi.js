import axiosClient from './axiosClient';

const orderApi = {
    // 1. Tạo đơn hàng mới (Khi người dùng nhấn Thanh toán/Đặt hàng)
    // orderData bao gồm: userId, items, totalAmount, address, phone...
    createOrder: (orderData, token) => {
        const url = '/order';
        return axiosClient.post(url, orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // 2. Lấy danh sách tất cả đơn hàng (Dành cho Admin hoặc Lịch sử User)
    // Nếu Backend trả về tất cả, Admin sẽ dùng cái này
    getAllOrders: (token) => {
        const url = '/order';
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // 3. Lấy chi tiết 1 đơn hàng theo ID
    getOrderById: (id, token) => {
        const url = `/order/${id}`;
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // 4. Cập nhật đơn hàng (Dành cho Admin cập nhật trạng thái: pending -> delivered)
    // data thường là { status: 'shipped' }
    updateOrder: (id, data, token) => {
        const url = `/order/${id}`;
        return axiosClient.put(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // 5. Hủy/Xóa đơn hàng
    deleteOrder: (id, token) => {
        const url = `/order/${id}`;
        return axiosClient.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export default orderApi;
