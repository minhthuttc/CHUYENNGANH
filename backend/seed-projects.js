// Script tạo 10 dự án mẫu
const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('./models/Project');
const User = require('./models/User');

const sampleProjects = [
    // Thiết kế Logo (3 dự án)
    {
        title: 'Thiết kế Logo cho Startup Tech',
        description: 'Cần thiết kế logo hiện đại cho công ty startup công nghệ. Yêu cầu phong cách tối giản, chuyên nghiệp.',
        category: 'logo',
        budget: 5000000,
        deadline: new Date('2025-01-15'),
        status: 'recruiting',
        skills: ['Logo Design', 'Illustrator', 'Branding']
    },
    {
        title: 'Logo Nhà hàng Việt Nam',
        description: 'Thiết kế logo cho nhà hàng ẩm thực Việt Nam, cần thể hiện văn hóa truyền thống.',
        category: 'logo',
        budget: 3000000,
        deadline: new Date('2025-01-20'),
        status: 'in_progress',
        skills: ['Logo Design', 'Photoshop']
    },
    {
        title: 'Logo Thương hiệu Mỹ phẩm',
        description: 'Thiết kế logo sang trọng cho thương hiệu mỹ phẩm cao cấp dành cho phụ nữ.',
        category: 'logo',
        budget: 6000000,
        deadline: new Date('2025-01-25'),
        status: 'recruiting',
        skills: ['Logo Design', 'Luxury Branding']
    },
    // UI/UX Design (3 dự án)
    {
        title: 'App Học Tiếng Anh Online',
        description: 'Thiết kế giao diện ứng dụng học tiếng Anh với trải nghiệm người dùng thân thiện.',
        category: 'uiux',
        budget: 15000000,
        deadline: new Date('2025-02-15'),
        status: 'recruiting',
        skills: ['UI/UX', 'Figma', 'Mobile Design']
    },
    {
        title: 'Website Bất động sản',
        description: 'Thiết kế giao diện website bất động sản chuyên nghiệp với bố cục rõ ràng.',
        category: 'uiux',
        budget: 20000000,
        deadline: new Date('2025-02-28'),
        status: 'in_progress',
        skills: ['UI/UX', 'Web Design']
    },
    {
        title: 'Website Nhà hàng',
        description: 'Thiết kế giao diện website nhà hàng sang trọng với menu trực quan.',
        category: 'uiux',
        budget: 12000000,
        deadline: new Date('2025-01-30'),
        status: 'recruiting',
        skills: ['UI/UX', 'Web Design', 'Figma']
    },
    // Thiết kế Poster (3 dự án)
    {
        title: 'Poster Sự kiện Âm nhạc',
        description: 'Thiết kế poster sự kiện âm nhạc với phong cách nhiệt đới, màu sắc rực rỡ.',
        category: 'print',
        budget: 2000000,
        deadline: new Date('2025-01-10'),
        status: 'recruiting',
        skills: ['Poster Design', 'Photoshop']
    },
    {
        title: 'Brochure Giới thiệu Công ty',
        description: 'Thiết kế brochure 3 trang giới thiệu công ty với thiết kế chuyên nghiệp.',
        category: 'print',
        budget: 4000000,
        deadline: new Date('2025-01-18'),
        status: 'in_progress',
        skills: ['Print Design', 'InDesign']
    },
    {
        title: 'Poster Khuyến mãi Tết 2025',
        description: 'Thiết kế poster quảng cáo chương trình khuyến mãi Tết với họa tiết truyền thống.',
        category: 'print',
        budget: 5000000,
        deadline: new Date('2025-02-10'),
        status: 'recruiting',
        skills: ['Poster Design', 'Photoshop']
    }
];

async function seedProjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Tìm client để làm chủ dự án
        let client = await User.findOne({ userType: 'client' });
        
        if (!client) {
            client = await User.findOne({ userType: 'admin' });
        }

        // Tìm designer
        let designer = await User.findOne({ userType: 'designer' });

        if (!client) {
            console.log('❌ Không tìm thấy user để làm client!');
            process.exit(1);
        }

        console.log(`👤 Client: ${client.fullName}`);
        if (designer) console.log(`🎨 Designer: ${designer.fullName}`);

        // Xóa projects cũ
        await Project.deleteMany({});
        console.log('🗑️ Đã xóa projects cũ');

        // Tạo projects mới
        for (const projectData of sampleProjects) {
            const project = new Project({
                ...projectData,
                client: client._id,
                designer: projectData.status === 'in_progress' || projectData.status === 'completed' ? designer?._id : null,
                requirements: ['Giao file gốc', 'Chỉnh sửa 3 lần', 'Bàn giao trong deadline'],
                progress: projectData.status === 'completed' ? 100 : projectData.status === 'in_progress' ? 50 : 0
            });
            await project.save();
            console.log(`✅ Tạo dự án: ${project.title}`);
        }

        console.log('\n🎉 Đã tạo 10 dự án mẫu thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

seedProjects();
