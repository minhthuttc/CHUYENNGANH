const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Lấy danh sách bài đăng
router.get('/', async (req, res) => {
    try {
        const { category, sort } = req.query;
        
        let query = { status: 'published' };
        
        // Lọc theo category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Sắp xếp
        let sortOption = { createdAt: -1 }; // Mới nhất
        if (sort === 'popular') {
            sortOption = { views: -1 };
        } else if (sort === 'mostLiked') {
            sortOption = { 'likes.length': -1 };
        }

        const posts = await Post.find(query)
            .populate('author', 'fullName email')
            .sort(sortOption)
            .lean();

        // Thêm số lượng likes
        const postsWithLikes = posts.map(post => ({
            ...post,
            likesCount: post.likes ? post.likes.length : 0
        }));

        res.json(postsWithLikes);
    } catch (error) {
        console.error('Lỗi lấy bài đăng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Lấy chi tiết bài đăng
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'fullName email bio skills rating');

        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
        }

        // Tăng lượt xem
        post.views += 1;
        await post.save();

        res.json({
            ...post.toObject(),
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error('Lỗi lấy chi tiết bài đăng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Tạo bài đăng mới (cần đăng nhập)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, imageUrl, tags } = req.body;

        const post = await Post.create({
            title,
            description,
            category,
            imageUrl,
            tags,
            author: req.user.userId,
            status: 'published'
        });

        res.status(201).json(post);
    } catch (error) {
        console.error('Lỗi tạo bài đăng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Like/Unlike bài đăng
router.post('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
        }

        const userId = req.user.userId;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            liked: likeIndex === -1,
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error('Lỗi like bài đăng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
