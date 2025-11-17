const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const Project = require('../models/Project');

// Tạo đánh giá mới
router.post('/create', async (req, res) => {
  try {
    const { projectId, ratings, comment, recommend } = req.body;

    // Lấy thông tin dự án
    const project = await Project.findById(projectId)
      .populate('client')
      .populate('designer');

    if (!project) {
      return res.status(404).json({ message: 'Không tìm thấy dự án!' });
    }

    // Tính điểm trung bình
    const averageRating = (
      ratings.overall +
      ratings.quality +
      ratings.communication +
      ratings.time
    ) / 4;

    // Tạo đánh giá
    const review = new Review({
      project: projectId,
      reviewer: project.client._id,
      reviewee: project.designer._id,
      ratings: ratings,
      averageRating: averageRating,
      comment: comment,
      recommend: recommend
    });

    await review.save();

    // Cập nhật rating của designer
    const designer = await User.findById(project.designer._id);
    const totalRating = (designer.rating * designer.reviewCount) + averageRating;
    designer.reviewCount += 1;
    designer.rating = totalRating / designer.reviewCount;
    await designer.save();

    console.log('✅ Đánh giá thành công:', review._id);

    res.status(201).json({
      message: 'Đánh giá thành công!',
      reviewId: review._id,
      averageRating: averageRating
    });
  } catch (error) {
    console.error('❌ Lỗi đánh giá:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy đánh giá của designer
router.get('/designer/:designerId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.designerId })
      .populate('reviewer', 'fullName avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy đánh giá của dự án
router.get('/project/:projectId', async (req, res) => {
  try {
    const review = await Review.findOne({ project: req.params.projectId })
      .populate('reviewer', 'fullName avatar')
      .populate('reviewee', 'fullName avatar');

    if (!review) {
      return res.status(404).json({ message: 'Chưa có đánh giá!' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật đánh giá
router.put('/:id', async (req, res) => {
  try {
    const { ratings, comment, recommend } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá!' });
    }

    // Kiểm tra thời gian (chỉ cho phép sửa trong 7 ngày)
    const daysSinceReview = (Date.now() - review.createdAt) / (1000 * 60 * 60 * 24);
    if (daysSinceReview > 7) {
      return res.status(403).json({ message: 'Không thể sửa đánh giá sau 7 ngày!' });
    }

    // Cập nhật
    const averageRating = (
      ratings.overall +
      ratings.quality +
      ratings.communication +
      ratings.time
    ) / 4;

    review.ratings = ratings;
    review.averageRating = averageRating;
    review.comment = comment;
    review.recommend = recommend;
    review.updatedAt = Date.now();

    await review.save();

    // Cập nhật lại rating của designer
    const allReviews = await Review.find({ reviewee: review.reviewee });
    const totalRating = allReviews.reduce((sum, r) => sum + r.averageRating, 0);
    const avgRating = totalRating / allReviews.length;

    await User.findByIdAndUpdate(review.reviewee, {
      rating: avgRating,
      reviewCount: allReviews.length
    });

    res.json({ message: 'Cập nhật đánh giá thành công!', review });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
