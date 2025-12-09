// Script tạo 10 bài đăng mẫu chia cho 6 nhà thiết kế
const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');
const User = require('./models/User');

// 6 nhà thiết kế
const designerNames = [
    'Phạm Quang Vinh',
    'Nguyễn Thành Trung', 
    'Lâm Vĩnh Lộc',
    'Nguyễn Nhật Trường',
    'Hứa Thị Thảo Vy',
    'Nguyễn Huỳnh Kỹ Thuật'
];

// Base URL cho ảnh
const IMAGE_BASE_URL = 'http://localhost:3000/images';

// 9 bài đăng với 3 danh mục (khớp với ảnh trong thư mục anh)
const samplePosts = [
    // Thiết kế Logo (3 bài)
    { title: 'Logo Quán Cà Phê Sunrise', description: 'Logo ấm áp cho quán cà phê với hình ảnh mặt trời mọc, màu cam và nâu tạo cảm giác thân thiện.', category: 'logo', tags: ['logo', 'cà phê', 'ấm áp'], designerIndex: 0, image: 'Logo Quán Cà Phê Sunrise.jpg', price: 500000 },
    { title: 'Logo Thương hiệu Thời trang', description: 'Logo sang trọng cho thương hiệu thời trang cao cấp, sử dụng font chữ thanh lịch.', category: 'logo', tags: ['logo', 'thời trang', 'sang trọng'], designerIndex: 1, image: 'Logo Thương hiệu Thời trang.jpg', price: 800000 },
    { title: 'Logo Startup Fintech', description: 'Logo cho startup tài chính công nghệ, thiết kế tối giản với biểu tượng đồng tiền số hóa.', category: 'logo', tags: ['logo', 'fintech', 'startup'], designerIndex: 2, image: 'Logo Startup Fintech.jpg', price: 1000000 },
    // UI/UX Design (3 bài)
    { title: 'App Học Tiếng Anh', description: 'Giao diện ứng dụng học tiếng Anh với trải nghiệm người dùng thân thiện, màu sắc tươi sáng và dễ sử dụng.', category: 'uiux', tags: ['uiux', 'mobile app', 'education'], designerIndex: 3, image: 'App Học Tiếng Anh.jpg', price: 2000000 },
    { title: 'Giao diện Website Bất động sản', description: 'Thiết kế giao diện website bất động sản chuyên nghiệp với bố cục rõ ràng, dễ tìm kiếm nhà đất.', category: 'uiux', tags: ['uiux', 'website', 'bất động sản'], designerIndex: 4, image: 'Giao diện Website Bất động sản.jpg', price: 3000000 },
    { title: 'Giao diện Website Nhà hàng', description: 'Thiết kế giao diện website nhà hàng sang trọng với menu trực quan và đặt bàn online.', category: 'uiux', tags: ['uiux', 'website', 'nhà hàng'], designerIndex: 5, image: 'Giao diện Website Nhà hàng.jpg', price: 2500000 },
    // Thiết kế Poster (3 bài)
    { title: 'Poster Sự kiện Âm nhạc Mùa Hè', description: 'Poster sự kiện âm nhạc với phong cách nhiệt đới, màu sắc rực rỡ thu hút người xem.', category: 'print', tags: ['poster', 'sự kiện', 'âm nhạc'], designerIndex: 0, image: 'Poster Sự kiện Âm nhạc Mùa Hè.jpg', price: 300000 },
    { title: 'Brochure Giới thiệu Công ty', description: 'Brochure 3 trang giới thiệu công ty với thiết kế chuyên nghiệp, bố cục rõ ràng.', category: 'print', tags: ['brochure', 'in ấn', 'công ty'], designerIndex: 1, image: 'Brochure Giới thiệu Công ty.jpg', price: 600000 },
    { title: 'Poster Khuyến mãi Tết 2025', description: 'Poster quảng cáo chương trình khuyến mãi Tết với họa tiết truyền thống Việt Nam.', category: 'print', tags: ['poster', 'tết', 'khuyến mãi'], designerIndex: 2, image: 'Poster Khuyến mãi Tết 2025.jpg', price: 400000 }
];

async function seedPosts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Tạo hoặc tìm 6 nhà thiết kế
        const designers = [];
        for (const name of designerNames) {
            let designer = await User.findOne({ fullName: name });
            if (!designer) {
                designer = new User({
                    fullName: name,
                    email: name.toLowerCase().replace(/\s+/g, '.') + '@designhub.com',
                    password: '$2a$10$XQxBtJXKQZPveuv/M5xnCeZ9.Aq5HjKjK1xvHvVQvLxvHvVQvLxvH',
                    userType: 'designer',
                    skills: ['Photoshop', 'Illustrator', 'Figma'],
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    completedProjects: Math.floor(Math.random() * 50) + 10
                });
                await designer.save();
                console.log(`👤 Tạo designer: ${name}`);
            } else {
                console.log(`👤 Đã có designer: ${name}`);
            }
            designers.push(designer);
        }

        // Xóa posts cũ
        await Post.deleteMany({});
        console.log('🗑️ Đã xóa posts cũ');

        // Tạo posts mới
        for (const postData of samplePosts) {
            const author = designers[postData.designerIndex];
            const imageUrl = `${IMAGE_BASE_URL}/${encodeURIComponent(postData.image)}`;
            const post = new Post({
                title: postData.title,
                description: postData.description,
                category: postData.category,
                tags: postData.tags,
                imageUrl: imageUrl,
                price: postData.price,
                author: author._id,
                views: Math.floor(Math.random() * 200) + 50,
                likes: [],
                status: 'published'
            });
            await post.save();
            console.log(`✅ Tạo bài: "${post.title}" - by ${author.fullName}`);
        }

        console.log('\n🎉 Đã tạo 9 bài đăng cho 6 nhà thiết kế thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

seedPosts();
