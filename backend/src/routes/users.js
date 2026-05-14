const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth, admin } = require('../middleware/auth');
const userController = require('../controllers/userControllers');


router.get('/', auth, admin, userController.index);          // chỉ admin xem danh sách
router.post('/create', upload.single("avatar"), userController.create); // public đăng ký
router.post('/login', userController.login);                // public login
router.get('/get/:id', auth, userController.getOne);        // user xem chính mình
router.put('/:id', auth, upload.single("avatar"), userController.update); // user sửa chính mình / admin sửa tất cả
router.delete('/:id', auth, admin, userController.delete); 

module.exports = router;
