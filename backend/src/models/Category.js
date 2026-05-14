const mongoose = require('mongoose');
// const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true });



module.exports = mongoose.model('Category', CategorySchema);
