const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Lấy tất cả projects với tìm kiếm và lọc
router.get('/', async (req, res) => {
  try {
    const { search, category, status, minBudget, maxBudget, sort } = req.query;
    
    // Build query
    let query = {};
    
    // Tìm kiếm theo tên hoặc mô tả
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Lọc theo danh mục
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Lọc theo trạng thái
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Lọc theo ngân sách
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }
    
    // Sắp xếp
    let sortOption = { createdAt: -1 }; // Mặc định: mới nhất
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'budget-high') sortOption = { budget: -1 };
    if (sort === 'budget-low') sortOption = { budget: 1 };
    if (sort === 'deadline') sortOption = { deadline: 1 };
    
    const projects = await Project.find(query)
      .populate('client', 'fullName email')
      .populate('designer', 'fullName email')
      .sort(sortOption);
    
    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Lỗi lấy dự án:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

// Lấy project theo ID
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID dự án không hợp lệ!' });
    }

    const project = await Project.findById(req.params.id)
      .populate('client', 'fullName email phone role createdAt')
      .populate('designer', 'fullName email rating role')
      .populate('applicants.designer', 'fullName email rating');
    
    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án!' });
    }
    
    console.log('✅ Project found:', project.title);
    res.json(project);
  } catch (error) {
    console.error('❌ Error getting project:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Tạo project mới
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ 
      message: 'Tạo dự án thành công!',
      project 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án!' });
    }
    
    res.json({ message: 'Cập nhật thành công!', project });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Ứng tuyển vào project
router.post('/:id/apply', async (req, res) => {
  try {
    const { designerId, message } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án!' });
    }
    
    project.applicants.push({
      designer: designerId,
      message
    });
    
    await project.save();
    res.json({ message: 'Ứng tuyển thành công!', project });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa project
router.delete('/:id', async (req, res) => {
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

// Tìm kiếm projects
router.get('/search/filter', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    
    const projects = await Project.find(query)
      .populate('client', 'fullName')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
