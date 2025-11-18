const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('./models/Project');
const User = require('./models/User');

async function updateProjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        const client = await User.findOne({ email: 'admin@designhub.com' });
        if (!client) {
            console.log('❌ Không tìm thấy user!');
            process.exit(1);
        }

        // Xóa dự án cũ
        await Project.deleteMany({});
        console.log('🗑️  Đã xóa dự án cũ');

        // Tạo 10 dự án mới với nội dung chi tiết
        const projects = [
            {
                title: 'Thiết Kế Logo Thương Hiệu Cafe Organic',
                description: 'Cần thiết kế logo cho chuỗi cafe organic mới. Logo cần thể hiện sự tự nhiên, thân thiện với môi trường và phong cách hiện đại. Màu sắc ưu tiên tông xanh lá, nâu đất. Bao gồm cả bộ nhận diện cơ bản.',
                category: 'logo',
                budget: 5500000,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Giao Diện App Đặt Đồ Ăn',
                description: 'Thiết kế UI/UX cho ứng dụng mobile đặt đồ ăn trực tuyến. Yêu cầu giao diện thân thiện, dễ sử dụng, tối ưu trải nghiệm người dùng. Bao gồm màn hình chính, danh mục, giỏ hàng, thanh toán và theo dõi đơn hàng.',
                category: 'uiux',
                budget: 18000000,
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Catalogue Sản Phẩm Nội Thất',
                description: 'Thiết kế catalogue giới thiệu bộ sưu tập nội thất cao cấp. Kích thước A4, 24 trang, phong cách sang trọng, hiện đại. Cần có khả năng chụp ảnh sản phẩm hoặc phối hợp với photographer.',
                category: 'print',
                budget: 8000000,
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Bao Bì Mỹ Phẩm Thiên Nhiên',
                description: 'Thiết kế bao bì cho dòng sản phẩm mỹ phẩm từ thiên nhiên. Bao gồm hộp đựng, nhãn chai, túi giấy. Phong cách tối giản, thanh lịch, thể hiện sự tự nhiên và an toàn. Cần file in ấn hoàn chỉnh.',
                category: 'packaging',
                budget: 12000000,
                deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Landing Page Khóa Học Online',
                description: 'Thiết kế landing page cho nền tảng khóa học online. Cần tối ưu conversion rate, responsive trên mọi thiết bị. Bao gồm hero section, giới thiệu khóa học, giảng viên, testimonials, pricing và form đăng ký.',
                category: 'web',
                budget: 15000000,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Bộ Nhận Diện Thương Hiệu Startup Fintech',
                description: 'Thiết kế bộ nhận diện thương hiệu hoàn chỉnh cho startup fintech. Bao gồm logo, color palette, typography, business card, letterhead, email signature, social media templates và brand guidelines.',
                category: 'branding',
                budget: 25000000,
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Minh Họa Truyện Thiếu Nhi',
                description: 'Cần minh họa cho cuốn truyện thiếu nhi 32 trang. Phong cách dễ thương, màu sắc tươi sáng, phù hợp với trẻ em 5-8 tuổi. Bao gồm nhân vật chính, bối cảnh và các trang minh họa đầy đủ.',
                category: 'illustration',
                budget: 16000000,
                deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Poster Sự Kiện Âm Nhạc',
                description: 'Thiết kế poster quảng cáo cho festival âm nhạc. Kích thước A1, phong cách năng động, trẻ trung. Cần thể hiện thông tin lineup nghệ sĩ, thời gian, địa điểm. File in ấn chất lượng cao.',
                category: 'print',
                budget: 4500000,
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Banner Quảng Cáo Facebook Ads',
                description: 'Thiết kế bộ banner quảng cáo cho chiến dịch Facebook Ads. Bao gồm 5 kích thước khác nhau, 3 concept khác nhau. Phong cách bắt mắt, call-to-action rõ ràng, phù hợp với đối tượng 25-40 tuổi.',
                category: 'print',
                budget: 3500000,
                deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            },
            {
                title: 'Thiết Kế Logo và Bộ Nhận Diện Nhà Hàng Nhật',
                description: 'Thiết kế logo và bộ nhận diện cho nhà hàng Nhật Bản cao cấp. Logo cần thể hiện sự tinh tế, truyền thống kết hợp hiện đại. Bao gồm menu, card visit, đồng phục, biển hiệu.',
                category: 'logo',
                budget: 9500000,
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
                client: client._id,
                status: 'recruiting'
            }
        ];

        const created = await Project.insertMany(projects);
        console.log(`✅ Đã tạo ${created.length} dự án mới!`);

        console.log('\n📋 Danh sách dự án theo danh mục:');
        
        const categories = {
            'logo': '🏷️  Logo Design',
            'uiux': '📱 UI/UX Design',
            'print': '🖨️  Print Design',
            'packaging': '📦 Packaging',
            'web': '🌐 Web Design',
            'branding': '✨ Branding',
            'illustration': '🎨 Illustration'
        };

        Object.keys(categories).forEach(cat => {
            const catProjects = created.filter(p => p.category === cat);
            if (catProjects.length > 0) {
                console.log(`\n${categories[cat]} (${catProjects.length} dự án):`);
                catProjects.forEach(p => {
                    console.log(`  • ${p.title} - ${p.budget.toLocaleString('vi-VN')} VNĐ`);
                });
            }
        });

        console.log('\n🎉 Hoàn thành! Mở http://localhost:3000/projects.html');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

updateProjects();