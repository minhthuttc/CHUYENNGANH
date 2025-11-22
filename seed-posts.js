// Script để tạo 10 bài đăng mẫu
const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');
const User = require('./models/User');

async function seedPosts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Lấy danh sách designers
        const designers = await User.find({ userType: 'designer' });
        
        if (designers.length === 0) {
            console.log('❌ Không tìm thấy designer. Vui lòng chạy seed-data.js trước!');
            process.exit(1);
        }

        // Xóa bài đăng cũ
        await Post.deleteMany({});
        console.log('🗑️  Đã xóa bài đăng cũ');

        // Dữ liệu 18 bài đăng (mỗi nhà thiết kế 3 bài)
        const postsData = [
            // Phạm Quang Vinh - Logo
            {
                title: 'Logo Hiện Đại Cho Startup Công Nghệ',
                description: 'Thiết kế logo tối giản, hiện đại với màu sắc gradient xanh dương. Phù hợp cho các công ty công nghệ, startup.',
                category: 'logo',
                tags: ['Logo', 'Startup', 'Modern', 'Tech']
            },
            {
                title: 'Logo Nhà Hàng Cao Cấp',
                description: 'Logo sang trọng cho nhà hàng fine dining với phong cách cổ điển, thanh lịch.',
                category: 'logo',
                tags: ['Logo', 'Restaurant', 'Luxury', 'Classic']
            },
            {
                title: 'Logo Thương Hiệu Thời Trang',
                description: 'Logo minimalist cho thương hiệu thời trang cao cấp, sử dụng typography độc đáo.',
                category: 'logo',
                tags: ['Logo', 'Fashion', 'Minimalist', 'Brand']
            },
            // Nguyễn Thành Trung - UI/UX
            {
                title: 'Giao Diện App Mobile Banking',
                description: 'Thiết kế UI/UX cho ứng dụng ngân hàng di động với trải nghiệm người dùng mượt mà, bảo mật cao.',
                category: 'uiux',
                tags: ['UI/UX', 'Mobile App', 'Banking', 'Fintech']
            },
            {
                title: 'Dashboard Quản Lý E-commerce',
                description: 'Thiết kế giao diện dashboard cho hệ thống quản lý bán hàng online với biểu đồ trực quan.',
                category: 'uiux',
                tags: ['UI/UX', 'Dashboard', 'E-commerce', 'Admin']
            },
            {
                title: 'App Đặt Đồ Ăn Online',
                description: 'Thiết kế UI/UX cho ứng dụng food delivery với flow đặt hàng đơn giản, nhanh chóng.',
                category: 'uiux',
                tags: ['UI/UX', 'Food', 'Delivery', 'Mobile']
            },
            // Nguyễn Nhật Trường - Poster
            {
                title: 'Poster Sự Kiện Âm Nhạc Mùa Hè',
                description: 'Poster sự kiện âm nhạc với màu sắc rực rỡ, năng động. Kích thước A2, in offset.',
                category: 'print',
                tags: ['Poster', 'Event', 'Music', 'Summer']
            },
            {
                title: 'Poster Quảng Cáo Sản Phẩm Mỹ Phẩm',
                description: 'Poster quảng cáo sản phẩm skincare với tone màu pastel nhẹ nhàng, nữ tính.',
                category: 'print',
                tags: ['Poster', 'Cosmetics', 'Advertising', 'Beauty']
            },
            {
                title: 'Poster Tuyển Dụng Nhân Sự',
                description: 'Poster tuyển dụng với thiết kế chuyên nghiệp, thu hút ứng viên chất lượng cao.',
                category: 'print',
                tags: ['Poster', 'Recruitment', 'HR', 'Corporate']
            },
            // Hứa Thị Thảo Vy - Logo
            {
                title: 'Logo Công Ty Xây Dựng',
                description: 'Logo mạnh mẽ, chuyên nghiệp cho công ty xây dựng với biểu tượng kiến trúc.',
                category: 'logo',
                tags: ['Logo', 'Construction', 'Architecture', 'Corporate']
            },
            {
                title: 'Logo Thương Hiệu Cafe',
                description: 'Logo ấm áp, thân thiện cho chuỗi cửa hàng cafe với phong cách vintage.',
                category: 'logo',
                tags: ['Logo', 'Cafe', 'Vintage', 'Cozy']
            },
            {
                title: 'Logo Trung Tâm Thể Thao',
                description: 'Logo năng động cho trung tâm gym & fitness với màu sắc tươi sáng.',
                category: 'logo',
                tags: ['Logo', 'Fitness', 'Sport', 'Dynamic']
            },
            // Lâm Vĩnh Lộc - UI/UX
            {
                title: 'Giao Diện Website Portfolio',
                description: 'Thiết kế UI/UX cho website portfolio cá nhân với layout sáng tạo, ấn tượng.',
                category: 'uiux',
                tags: ['UI/UX', 'Website', 'Portfolio', 'Creative']
            },
            {
                title: 'App Học Tiếng Anh Online',
                description: 'Thiết kế UI/UX cho ứng dụng học ngôn ngữ với giao diện thân thiện, dễ sử dụng.',
                category: 'uiux',
                tags: ['UI/UX', 'Education', 'Language', 'Mobile']
            },
            {
                title: 'Website Bất Động Sản',
                description: 'Thiết kế giao diện website tìm kiếm và đăng tin bất động sản hiện đại.',
                category: 'uiux',
                tags: ['UI/UX', 'Real Estate', 'Website', 'Search']
            },
            // Nguyễn Huỳnh Kỹ Thuật - Poster
            {
                title: 'Poster Triển Lãm Nghệ Thuật',
                description: 'Poster cho triển lãm tranh đương đại với thiết kế nghệ thuật, độc đáo.',
                category: 'print',
                tags: ['Poster', 'Art', 'Exhibition', 'Contemporary']
            },
            {
                title: 'Poster Sự Kiện Từ Thiện',
                description: 'Poster kêu gọi quyên góp cho chương trình từ thiện với thông điệp nhân văn.',
                category: 'print',
                tags: ['Poster', 'Charity', 'Social', 'Humanity']
            },
            {
                title: 'Poster Khuyến Mãi Mùa Lễ',
                description: 'Poster quảng cáo chương trình khuyến mãi cuối năm với màu sắc lễ hội.',
                category: 'print',
                tags: ['Poster', 'Sale', 'Promotion', 'Holiday']
            }
        ];

        // Tạo bài đăng
        const posts = [];
        for (let i = 0; i < postsData.length; i++) {
            const designer = designers[i % designers.length];
            const post = await Post.create({
                ...postsData[i],
                author: designer._id,
                views: Math.floor(Math.random() * 500) + 50,
                likes: [],
                status: 'published'
            });
            posts.push(post);
        }

        console.log(`✅ Đã tạo ${posts.length} bài đăng mẫu!`);
        console.log('\n📊 Thống kê:');
        console.log(`- Logo Design: ${posts.filter(p => p.category === 'logo').length} bài`);
        console.log(`- UI/UX Design: ${posts.filter(p => p.category === 'uiux').length} bài`);
        console.log(`- Thiết kế Poster: ${posts.filter(p => p.category === 'print').length} bài`);
        console.log('\n👥 Phân bổ theo nhà thiết kế:');
        designers.forEach((designer, index) => {
            const designerPosts = posts.filter(p => p.author.toString() === designer._id.toString());
            console.log(`- ${designer.fullName}: ${designerPosts.length} bài`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

seedPosts();
