const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve ảnh từ thư mục anh - truy cập qua http://localhost:3000/images/ten-anh.jpg
app.use('/images', express.static('anh'));

// Import init admin
const initDefaultAdmin = require('./init-admin');

// MongoDB Connection với timeout và retry
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Tăng timeout lên 30 giây
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000
    });
    
    console.log('✅ Kết nối MongoDB thành công!');
    console.log('📊 Database: designhub');
    console.log(`🔗 Host: ${conn.connection.host}`);
    
    // Tạo admin mặc định
    await initDefaultAdmin();
    
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
    console.log('🔧 Hướng dẫn sửa lỗi:');
    console.log('1. Kiểm tra IP whitelist trong MongoDB Atlas');
    console.log('2. Đảm bảo internet ổn định');
    console.log('3. Kiểm tra username/password trong .env');
    
    // Retry sau 5 giây
    console.log('🔄 Thử kết nối lại sau 5 giây...');
    setTimeout(connectDB, 5000);
  }
};

// Kết nối database
connectDB();

// Import routes
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const postRoutes = require('./routes/posts');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/posts', postRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API đang hoạt động!', status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📱 API endpoint: http://localhost:${PORT}/api`);
});
