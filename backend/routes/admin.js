const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');

// Middleware kiểm tra admin
const checkAdmin = (req, res, next) => {
  // Trong production, nên kiểm tra JWT token
  // Tạm thời bỏ qua để demo
  next();
};

// ===== QUẢN LÝ NGƯỜI DÙNG =====

// Lấy tất cả người dùng
router.get('/users', checkAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Khóa/Mở khóa người dùng
router.put('/users/:id/toggle-status', checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    res.json({ 
      message: `Đã ${user.status === 'blocked' ? 'khóa' : 'mở khóa'} người dùng!`,
      user: { id: user._id, status: user.status }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa người dùng
router.delete('/users/:id', checkAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    res.json({ message: 'Đã xóa người dùng thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// ===== QUẢN LÝ DỰ ÁN =====

// Lấy tất cả dự án
router.get('/projects', checkAdmin, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('client', 'fullName email')
      .populate('designer', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật trạng thái dự án
router.put('/projects/:id/status', checkAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án!' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công!', project });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa dự án
router.delete('/projects/:id', checkAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án!' });
    }

    res.json({ message: 'Đã xóa dự án thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// ===== QUẢN LÝ THANH TOÁN =====

// Lấy tất cả giao dịch
router.get('/transactions', checkAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('project', 'title')
      .populate('from', 'fullName email')
      .populate('to', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật trạng thái giao dịch
router.put('/transactions/:id/status', checkAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch!' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công!', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// ===== BÁO CÁO VÀ THỐNG KÊ =====

// Thống kê tổng quan
router.get('/statistics', checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDesigners = await User.countDocuments({ userType: 'designer' });
    const totalClients = await User.countDocuments({ userType: 'client' });
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'in_progress' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyRevenue = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setDate(1)) }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    const avgRating = await User.aggregate([
      { $match: { userType: 'designer', reviewCount: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      totalUsers,
      totalDesigners,
      totalClients,
      totalProjects,
      activeProjects,
      completedProjects,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      newUsersThisMonth,
      avgRating: avgRating[0]?.avgRating || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Top nhà thiết kế
router.get('/top-designers', checkAdmin, async (req, res) => {
  try {
    const topDesigners = await User.find({ userType: 'designer' })
      .sort({ completedProjects: -1, rating: -1 })
      .limit(10)
      .select('-password');
    
    res.json(topDesigners);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Doanh thu theo tháng
router.get('/revenue-by-month', checkAdmin, async (req, res) => {
  try {
    const revenueByMonth = await Transaction.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json(revenueByMonth);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
