const Order = require('../models/Order');

class OrderController {
    // [GET] /orders - Lấy danh sách đơn hàng (Cho Admin)
    // controllers/OrderController.js
async index(req, res) {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        // Trả về trực tiếp mảng orders
        res.json(orders); 
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
}

    // [POST] /orders - Tạo đơn hàng mới (Khi khách nhấn Đặt hàng)
    async create(req, res) {
        try {
            const orderData = req.body;
            const newOrder = new Order(orderData);
            await newOrder.save();
            res.status(201).json({
                message: "Đặt hàng thành công",
                data: newOrder
            });
        } catch (err) {
            res.status(500).json({ message: "Lỗi đặt hàng", error: err.message });
        }
    }
    // Thêm vào trong class CartController của bạn

    // [PUT] /orders/:id - Cập nhật trạng thái đơn hàng (Cho Admin)
    async update(req, res) {
    try {
        const { id } = req.params;
        console.log("ID nhận được:", id);      // Kiểm tra xem ID có bị undefined không
        console.log("Dữ liệu body:", req.body); // Kiểm tra xem có nhận được { status: ... } không

        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng trong DB" });
        }
        res.json({
            message: "Cập nhật đơn hàng thành công",
            data: updatedOrder
        });
    } catch (err) {
        console.error("Lỗi tại Controller:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
}
    // [DELETE] /orders/:id - Xóa đơn hàng
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedOrder = await Order.findByIdAndDelete(id);

            if (!deletedOrder) {
                return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            }

            res.status(200).json({
                message: "Xóa đơn hàng thành công"
            });
        } catch (err) {
            res.status(500).json({ message: "Lỗi server", error: err.message });
        }
    }
}

module.exports = new OrderController();