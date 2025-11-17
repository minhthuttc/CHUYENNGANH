const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Lấy tất cả users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy user theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user!' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user!' });
    }
    
    res.json({ message: 'Cập nhật thành công!', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Tìm kiếm designers
router.get('/designers/search', async (req, res) => {
  try {
    const { skill, experience } = req.query;
    let query = { userType: 'designer', status: 'active' };
    
    if (skill) {
      query.skills = { $in: [skill] };
    }
    
    const designers = await User.find(query).select('-password');
    res.json(designers);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
