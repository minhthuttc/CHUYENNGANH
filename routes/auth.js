const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng!' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone: '',
      userType
    });

    await user.save();

    res.status(201).json({ 
      message: 'Đăng ký thành công!',
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Đăng ký Admin với mã bảo mật
router.post('/register-admin', async (req, res) => {
  try {
    const { fullName, email, password, securityCode, adminRole } = req.body;

    // Mã bảo mật admin
    const ADMIN_SECURITY_CODE = 'DESIGNHUB_ADMIN_110122174';

    // Log chi tiết
    console.log('=== KIỂM TRA MÃ BẢO MẬT ===');
    console.log('Mã đúng:', ADMIN_SECURITY_CODE);
    console.log('Mã nhận:', securityCode);
    console.log('Mã sau trim:', securityCode ? securityCode.trim() : 'null');
    console.log('Độ dài đúng:', ADMIN_SECURITY_CODE.length);
    console.log('Độ dài nhận:', securityCode ? securityCode.length : 0);
    console.log('Khớp:', securityCode && securityCode.trim() === ADMIN_SECURITY_CODE);
    console.log('============================');

    // Kiểm tra mã bảo mật (trim để loại bỏ khoảng trắng)
    if (!securityCode || securityCode.trim() !== ADMIN_SECURITY_CODE) {
      console.log('❌ Mã bảo mật không đúng!');
      return res.status(403).json({ 
        message: 'Mã bảo mật Admin không đúng!'
      });
    }
    
    console.log('✅ Mã bảo mật chính xác!');

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng!' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo admin mới
    const admin = new User({
      fullName,
      email,
      password: hashedPassword,
      phone: '',
      userType: 'admin',
      adminRole: adminRole || 'admin',
      status: 'active'
    });

    await admin.save();

    // Log hoạt động
    console.log(`✅ Admin mới được tạo: ${email} - Role: ${adminRole}`);

    res.status(201).json({ 
      message: 'Đăng ký admin thành công!',
      userId: admin._id,
      user: {
        email: admin.email,
        fullName: admin.fullName,
        adminRole: admin.adminRole || 'admin'
      }
    });
  } catch (error) {
    console.error('❌ Lỗi đăng ký admin:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy thông tin user theo ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json(user);
  } catch (error) {
    console.error('Lỗi lấy thông tin user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
