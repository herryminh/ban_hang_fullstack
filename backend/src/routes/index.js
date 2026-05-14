const productRoutes = require('./products');
const userRoutes = require('./users');
const orderRoutes = require('./orders');
const variantRoutes = require('./variant');
const  categoryRoutes = require ('./category');
const cartRoutes = require('./cart')

const Product = require('../models/Product');
const Category = require('../models/Category');

function route(app) {
   // Homepage hiển thị danh sách sản phẩm
  app.get('/', async (req, res) => {
    const products = await Product.find(); // lấy từ MongoDB
    res.json({
      message: "Homepage - danh sách sản phẩm",
      data: products
    });
  });

  // Các route /product vẫn giữ như bình thường
  app.use('/product', productRoutes);
  app.use('/user', userRoutes);
  app.use('/order', orderRoutes);
  app.use('/variants', variantRoutes);
  app.use('/category', categoryRoutes);
  app.use('/cart',cartRoutes)
  // 404
 
}

module.exports = route;
