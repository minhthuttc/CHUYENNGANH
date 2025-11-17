const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công!');
    console.log('📊 Database: designhub');
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  });

// Import routes
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API đang hoạt động!', status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📱 API endpoint: http://localhost:${PORT}/api`);
});
