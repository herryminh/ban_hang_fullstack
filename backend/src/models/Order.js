const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    // Thêm phương thức thanh toán để biết khách trả COD hay Chuyển khoản
    paymentMethod: { type: String, default: 'cod' }, 
    items: [
        {
            productId: { type: String, required: true },
            variantId: { type: String }, // Lưu ID của biến thể
            sku: { type: String },       // CỰC KỲ QUAN TRỌNG để soạn hàng
            name: { type: String },
            color: { type: String },     // Màu sắc khách chọn
            size: { type: String },      // Kích thước khách chọn
            image: { type: String },     // Ảnh sản phẩm lúc đặt để đối soát
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    customerNote: { type: String, default: '' }, // Khách để lại lúc đặt hàng
    adminNote: { type: String, default: '' },
    status: { 
        type: String, 
        default: 'pending', 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] 
    }
}, { 
    timestamps: true // Tự động tạo createdAt và updatedAt chuyên nghiệp hơn
});

module.exports = mongoose.model('Order', OrderSchema);