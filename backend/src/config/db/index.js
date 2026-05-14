const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/web_shop_prod'); // chỉ cần URI thôi
    console.log('MongoDB connected!');
  } catch (err) {
    console.error('connect fail !!!:', err);
  }
};

module.exports = { connect };


module.exports = { connect };
