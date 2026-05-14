const jwt = require('jsonwebtoken');

// Middleware auth
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Chưa đăng nhập' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token không hợp lệ' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
}

// Middleware admin
function admin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }
  next();
}

// ✅ Export đúng cách
module.exports = { auth, admin };
