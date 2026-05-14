const User = require('../models/User');
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
class UserController {

  // GET /user
  async index(req, res) {
    try {
      const users = await User.find();
      const count = users.length;

      res.json({
        message: "Danh sách người dùng",
        count,
        data: users
      });

    } catch (err) {
      res.status(500).json({
        message: "Lỗi server",
        error: err.message
      });
    }
  }


  // POST /user/create
  async create(req, res) {
    try {
      const { name, userName, password, email, phoneNumber } = req.body;

      const newUser = new User({
        name,
        userName,
        password,
        email,
        phoneNumber,
        role: "customer",
        avatar: req.file ? "/avatars/" + req.file.filename : null
      });

      await newUser.save();

      res.status(201).json({
        message: "Tạo tài khoản thành công",
        data: newUser
      });

    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }


  // POST /user/login

async login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Sai email hoặc password" });
    }

    // 🔥 Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      data: {
        user,
        token  // 🔑 đây là token
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
}

  // GET /user/:id
async getOne(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({
      message: "Lấy thông tin người dùng thành công",
      data: user
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
}


 async update(req, res) {
    try {
        const { id } = req.params;

        // Tìm user cũ
        const oldUser = await User.findById(id);
        if (!oldUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const updateData = { ...req.body };

        // Nếu có avatar mới
        if (req.file) {

            // 1️⃣ Có avatar cũ → xoá
            if (oldUser.avatar) {

                // Ví dụ oldUser.avatar = "/avatars/abc.jpg"
                const oldFileName = oldUser.avatar.split("/avatars/")[1];

                if (oldFileName) {
                    const oldFilePath = path.join(__dirname, "..", "uploads", "avatars", oldFileName);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                        console.log("Đã xoá ảnh cũ:", oldFilePath);
                    }
                }
            }

            // 2️⃣ Gán avatar mới
            updateData.avatar = "/avatars/" + req.file.filename;
        }

        // Nếu password rỗng thì không update
        if (!updateData.password || updateData.password.trim() === "") {
            delete updateData.password;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        return res.json({
            message: "Cập nhật thành công",
            data: updatedUser,
        });

    } catch (err) {
        console.error("Lỗi server:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
}


  // DELETE /user/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.json({ message: "Xóa tài khoản thành công" });

    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }
}

module.exports = new UserController();
