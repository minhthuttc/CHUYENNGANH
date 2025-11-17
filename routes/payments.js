const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Project = require('../models/Project');

// Tạo thanh toán mới
router.post('/create', async (req, res) => {
  try {
    const { projectId, paymentMethod, note, amount } = req.body;

    // Validate input
    if (!projectId || !paymentMethod || !amount) {
      return res.status(400).json({ 
        message: 'Thiếu thông tin thanh toán!' 
      });
    }

    // Validate payment method
    const validMethods = ['bank_transfer', 'momo', 'zalopay', 'credit_card'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ 
        message: 'Phương thức thanh toán không hợp lệ!' 
      });
    }

    // Lấy thông tin dự án
    const project = await Project.findById(projectId)
      .populate('client', 'fullName email')
      .populate('designer', 'fullName email');

    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án!' });
    }

    // Kiểm tra trạng thái dự án
    if (project.status === 'completed') {
      return res.status(400).json({ 
        message: 'Dự án này đã được thanh toán!' 
      });
    }

    if (project.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Không thể thanh toán cho dự án đã hủy!' 
      });
    }

    // Kiểm tra số tiền
    const expectedAmount = project.budget * 1.05; // +5% phí dịch vụ
    if (Math.abs(amount - expectedAmount) > 1000) {
      return res.status(400).json({ 
        message: 'Số tiền thanh toán không chính xác!' 
      });
    }

    // Tạo giao dịch
    const transaction = new Transaction({
      project: projectId,
      from: project.client._id,
      to: project.designer._id,
      amount: amount,
      paymentMethod: paymentMethod,
      description: note || `Thanh toán cho dự án: ${project.title}`,
      status: 'completed' // Demo: Tự động hoàn thành
    });

    await transaction.save();

    // Cập nhật trạng thái dự án
    project.status = 'completed';
    project.completedAt = new Date();
    await project.save();

    console.log('✅ Thanh toán thành công:', transaction.transactionId);
    console.log(`   Dự án: ${project.title}`);
    console.log(`   Số tiền: ${amount.toLocaleString('vi-VN')} VNĐ`);
    console.log(`   Phương thức: ${paymentMethod}`);

    res.status(201).json({
      message: 'Thanh toán thành công!',
      transactionId: transaction.transactionId,
      projectId: projectId,
      paymentMethod: paymentMethod,
      amount: amount,
      project: {
        title: project.title,
        designer: project.designer.fullName
      }
    });
  } catch (error) {
    console.error('❌ Lỗi thanh toán:', error);
    res.status(500).json({ 
      message: 'Lỗi xử lý thanh toán', 
      error: error.message 
    });
  }
});

// Lấy lịch sử thanh toán
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: 'Thiếu thông tin người dùng!' });
    }
    
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }]
    })
      .populate('project', 'title budget status')
      .populate('from', 'fullName email')
      .populate('to', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(50); // Giới hạn 50 giao dịch gần nhất

    // Thêm thông tin loại giao dịch (gửi/nhận)
    const enrichedTransactions = transactions.map(tx => ({
      ...tx.toObject(),
      type: tx.from._id.toString() === userId ? 'sent' : 'received'
    }));

    res.json(enrichedTransactions);
  } catch (error) {
    console.error('❌ Lỗi lấy lịch sử:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy chi tiết giao dịch
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('project')
      .populate('from', 'fullName email')
      .populate('to', 'fullName email');

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch!' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('❌ Lỗi lấy chi tiết:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Thống kê thanh toán
router.get('/stats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tổng tiền đã gửi
    const sentTransactions = await Transaction.find({ 
      from: userId, 
      status: 'completed' 
    });
    const totalSent = sentTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Tổng tiền đã nhận
    const receivedTransactions = await Transaction.find({ 
      to: userId, 
      status: 'completed' 
    });
    const totalReceived = receivedTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Số lượng giao dịch
    const totalTransactions = sentTransactions.length + receivedTransactions.length;

    res.json({
      totalSent,
      totalReceived,
      totalTransactions,
      sentCount: sentTransactions.length,
      receivedCount: receivedTransactions.length
    });
  } catch (error) {
    console.error('❌ Lỗi thống kê:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
