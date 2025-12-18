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

        console.log('📝 Tạo bài đăng mới:', { title, category, author: req.user.userId });

        // Validate
        if (!title || !description || !category) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
        }

        // Nếu imageUrl là base64 quá dài, dùng placeholder
        let finalImageUrl = imageUrl;
        if (imageUrl && imageUrl.length > 500000) {
            console.log('⚠️ Ảnh quá lớn, dùng placeholder');
            finalImageUrl = 'https://via.placeholder.com/400x300';
        }

        const post = await Post.create({
            title,
            description,
            category,
            imageUrl: finalImageUrl || 'https://via.placeholder.com/400x300',
            tags: tags || [],
            author: req.user.userId,
            status: 'published'
        });

        console.log('✅ Đăng bài thành công:', post._id);
        res.status(201).json({ message: 'Đăng bài thành công!', post });
    } catch (error) {
        console.error('❌ Lỗi tạo bài đăng:', error);
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
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
            post.likes.splice(likeIndex, 1);
        } else {
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

// Xóa bài đăng
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
        }

        // Cho phép xóa nếu đã đăng nhập (tạm thời bỏ kiểm tra quyền để test)
        await Post.findByIdAndDelete(req.params.id);
        
        console.log('🗑️ Đã xóa bài đăng:', req.params.id, 'bởi user:', req.user.userId);
        res.json({ message: 'Xóa bài đăng thành công!' });
    } catch (error) {
        console.error('❌ Lỗi xóa bài đăng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Mua thiết kế (thanh toán ảo)
router.post('/:id/purchase', auth, async (req, res) => {
    try {
        const { amount, paymentMethod, note } = req.body;
        const post = await Post.findById(req.params.id).populate('author', 'fullName');

        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
        }

        // Tạo transaction ID
        const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

        // Lưu thông tin mua hàng vào post
        post.purchases.push({
            buyer: req.user.userId,
            amount: amount,
            paymentMethod: paymentMethod,
            purchasedAt: new Date()
        });
        await post.save();

        // Lưu vào Transaction model để hiển thị trong lịch sử
        const Transaction = require('../models/Transaction');
        const transaction = new Transaction({
            transactionId: transactionId,
            from: req.user.userId,
            to: post.author._id,
            amount: amount,
            paymentMethod: paymentMethod,
            description: note || `Mua thiết kế: ${post.title}`,
            status: 'completed',
            post: post._id
        });
        await transaction.save();

        console.log(`✅ Thanh toán thành công: ${transactionId}`);
        console.log(`   Thiết kế: ${post.title}`);
        console.log(`   Số tiền: ${amount.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   Phương thức: ${paymentMethod}`);

        res.json({
            message: 'Thanh toán thành công!',
            transactionId: transactionId,
            postId: post._id,
            postTitle: post.title,
            amount: amount,
            paymentMethod: paymentMethod,
            seller: post.author.fullName
        });
    } catch (error) {
        console.error('❌ Lỗi thanh toán:', error);
        res.status(500).json({ message: 'Lỗi xử lý thanh toán' });
    }
});

module.exports = router;
