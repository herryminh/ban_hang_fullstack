const mongoose =  require('mongoose');
const { Schema } = mongoose;



const User = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },

    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },

    password: {
      type: String,
      required: true,
      minlength: 6, // nên có để bảo mật
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },

    avatar: {
      type: String,
      default: "", // ảnh mặc định
    },
  },
  {
    timestamps: true, // tự tạo createdAt và updatedAt
  });

module.exports = mongoose.model('User', User);
