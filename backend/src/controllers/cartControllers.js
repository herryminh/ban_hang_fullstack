const Cart = require('../models/Cart'); // bạn sẽ tạo model Cart
const mongoose = require('mongoose');

class CartController {
  // POST /cart → thêm sản phẩm vào giỏ
  async addToCart(req, res) {
    try {
      // Tạm thời lấy userId từ body để bạn dễ test khi chưa có Auth
      const userId = req.body.userId || "temp_user_123"; 
      
      const { productId, variantId, size, quantity, price, name, color, image, sku } = req.body;

      // 1. Tạo _id theo format bạn muốn: productId-SKU
      const cartDocId = `${productId}-${sku}`;

      // 2. Tìm giỏ hàng này của user
      let cart = await Cart.findOne({ _id: cartDocId, userId });

      if (cart) {
        // Đã có giỏ hàng này -> Tìm xem SKU này đã có trong mảng items chưa
        const itemIndex = cart.items.findIndex(item => item.sku === sku);

        if (itemIndex > -1) {
          // Nếu trùng SKU và Size -> Cộng dồn số lượng
          cart.items[itemIndex].quantity += Number(quantity);
          cart.items[itemIndex].updatedAt = Date.now();
        } else {
          // Nếu SKU khác (hiếm khi xảy ra với cấu trúc ID này) -> Push mới
          cart.items.push({ productId, variantId, name, color, size, sku, price, image, quantity });
        }
        await cart.save();
      } else {
        // 3. Nếu chưa có -> Tạo mới hoàn toàn một document giỏ hàng
        cart = await Cart.create({
          _id: cartDocId, // Lưu theo format bạn muốn
          userId,
          items: [
            {
              productId,
              variantId,
              name,
              color,
              size,
              sku,
              price,
              image,
              quantity
            }
          ]
        });
      }

      res.status(201).json({ 
        message: 'Lưu vào database thành công', 
        data: cart 
      });
    } catch (err) {
      console.error('Lỗi addToCart:', err);
      res.status(500).json({ message: err.message });
    }
  }

  // Lấy giỏ hàng (Sửa lại để lấy mảng items của user đó)
  async getMyCart(req, res) {
    try {
      const userId = req.query.userId || "temp_user_123";
      const carts = await Cart.find({ userId }); 
      res.json(carts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async updateCartItem(req, res) {
  try {
    const userId = req.body.userId || "temp_user_123";
    const { id } = req.params; // id này chính là "productId-sku"
    const { quantity } = req.body;

    const cart = await Cart.findOne({ _id: id, userId });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    // Cập nhật số lượng trong mảng items
    cart.items[0].quantity = Number(quantity);
    cart.items[0].updatedAt = Date.now();

    await cart.save();
    res.json({ message: 'Cập nhật thành công', data: cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Xóa một sản phẩm cụ thể
async removeCartItem(req, res) {
    try {
        const { id } = req.params; // id này chính là "6943...-MAXI-RED-M"
        
        // Dùng đúng id để xóa trong MongoDB
        const result = await Cart.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }
        
        res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async updateQuantity (req, res) {
        try {
            const { id } = req.params; // Lấy id là "6944e7c9...-Standard-2" từ URL
            const { quantity } = req.body; // Lấy số lượng mới từ body

            if (quantity < 1) {
                return res.status(400).json({ message: 'Số lượng không được nhỏ hơn 1' });
            }

            // Tìm document có _id trùng với id truyền lên và cập nhật trường items[0].quantity
            const updatedCart = await Cart.findByIdAndUpdate(
                id,
                { $set: { "items.0.quantity": quantity } },
                { new: true }
            );

            if (!updatedCart) {
                return res.status(404).json({ message: 'Không tìm thấy mục giỏ hàng này' });
            }

            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Lỗi Update Cart:', error);
            res.status(500).json({ message: 'Lỗi server khi cập nhật số lượng' });
        }
    }
// controllers/CartController.js
// controllers/CartController.js

// controllers/CartController.js

async clearCart(req, res) {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId!' });
        }

        // Lệnh này sẽ xóa tất cả các bản ghi có userId này trong collection carts
        const result = await Cart.deleteMany({ userId: userId });

        console.log(`Đã xóa sạch giỏ hàng của user ${userId}. Số lượng bản ghi bị xóa: ${result.deletedCount}`);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng nào để xóa!' });
        }

        res.status(200).json({ 
            message: 'Đã xóa sạch hoàn toàn giỏ hàng khỏi database!',
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        console.error('Lỗi khi xóa sạch giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}
}
module.exports = new CartController();
