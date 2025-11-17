// Mock server để test API không cần MongoDB
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Mock database
const mockUsers = [];
const mockProjects = [];

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API đang hoạt động!', status: 'success' });
});

// Lấy tất cả dự án
app.get('/api/projects', (req, res) => {
  try {
    console.log('📋 Lấy danh sách dự án:', mockProjects.length);
    res.json(mockProjects);
  } catch (error) {
    console.error('❌ Lỗi lấy dự án:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy dự án theo ID
app.get('/api/projects/:id', (req, res) => {
  try {
    const project = mockProjects.find(p => p._id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án!' });
    }
    
    console.log('📄 Lấy chi tiết dự án:', project._id);
    res.json(project);
  } catch (error) {
    console.error('❌ Lỗi lấy dự án:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Tạo dự án mới
app.post('/api/projects', (req, res) => {
  try {
    const { title, description, category, budget, deadline, status } = req.body;
    
    // Lấy user từ token (mock)
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId = 'mock_user_' + Date.now();
    
    // Tìm user từ token
    if (token) {
      const decoded = mockUsers.find(u => u._id.includes('user') || u._id.includes('admin'));
      if (decoded) userId = decoded._id;
    }

    const project = {
      _id: 'project_' + Date.now(),
      title,
      description,
      category,
      budget,
      deadline,
      status: status || 'pending',
      client: {
        _id: userId,
        fullName: 'Mock User',
        email: 'mock@example.com'
      },
      designer: null,
      createdAt: new Date(),
      applicants: [],
      progress: 0
    };

    mockProjects.push(project);
    
    console.log('✅ Tạo dự án mới:', project._id);
    
    res.status(201).json({ 
      message: 'Tạo dự án thành công!',
      project 
    });
  } catch (error) {
    console.error('❌ Lỗi tạo dự án:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;

    console.log('📝 Đăng ký mới:', { fullName, email, userType });

    // Kiểm tra email đã tồn tại
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng!' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = {
      _id: 'user_' + Date.now(),
      fullName,
      email,
      password: hashedPassword,
      userType,
      createdAt: new Date()
    };

    mockUsers.push(user);

    console.log('✅ Đăng ký thành công:', user._id);

    res.status(201).json({ 
      message: 'Đăng ký thành công!',
      userId: user._id 
    });
  } catch (error) {
    console.error('❌ Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Đăng ký Admin
app.post('/api/auth/register-admin', async (req, res) => {
  try {
    const { fullName, email, password, securityCode, adminRole } = req.body;

    const ADMIN_SECURITY_CODE = 'DESIGNHUB_ADMIN_110122174';

    console.log('🔐 Đăng ký admin:', { fullName, email, adminRole });

    if (!securityCode || securityCode.trim() !== ADMIN_SECURITY_CODE) {
      console.log('❌ Mã bảo mật không đúng!');
      return res.status(403).json({ 
        message: 'Mã bảo mật Admin không đúng!'
      });
    }

    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = {
      _id: 'admin_' + Date.now(),
      fullName,
      email,
      password: hashedPassword,
      userType: 'admin',
      adminRole: adminRole || 'admin',
      status: 'active',
      createdAt: new Date()
    };

    mockUsers.push(admin);

    console.log('✅ Admin được tạo:', admin._id);

    res.status(201).json({ 
      message: 'Đăng ký admin thành công!',
      userId: admin._id,
      user: {
        email: admin.email,
        fullName: admin.fullName,
        adminRole: admin.adminRole
      }
    });
  } catch (error) {
    console.error('❌ Lỗi đăng ký admin:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Đăng nhập:', email);

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      'mock_jwt_secret',
      { expiresIn: '7d' }
    );

    console.log('✅ Đăng nhập thành công:', user._id);

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
    console.error('❌ Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════');
  console.log('   🚀 MOCK SERVER - KHÔNG CẦN MONGODB');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📱 API endpoint: http://localhost:${PORT}/api`);
  console.log('');
  console.log('💡 Server này dùng để test API mà không cần MongoDB');
  console.log('📝 Dữ liệu lưu trong RAM, sẽ mất khi restart');
  console.log('');
  console.log('🧪 Test ngay:');
  console.log(`   http://localhost:${PORT}/check-server.html`);
  console.log('═══════════════════════════════════════════════════');
});
