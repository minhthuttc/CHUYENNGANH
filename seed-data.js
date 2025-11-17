// Script để tạo dữ liệu mẫu
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const Transaction = require('./models/Transaction');

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Xóa dữ liệu cũ
        await User.deleteMany({});
        await Project.deleteMany({});
        await Transaction.deleteMany({});
        console.log('🗑️  Đã xóa dữ liệu cũ');

        // Tạo admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            fullName: 'Admin',
            email: 'admin@designhub.com',
            password: adminPassword,
            userType: 'admin',
            status: 'active'
        });
        console.log('✅ Đã tạo tài khoản admin');

        // Tạo designers
        const designers = [];
        for (let i = 1; i <= 10; i++) {
            const password = await bcrypt.hash('123456', 10);
            const designer = await User.create({
                fullName: `Nhà Thiết Kế ${i}`,
                email: `designer${i}@example.com`,
                password: password,
                userType: 'designer',
                status: 'active',
                bio: `Chuyên gia thiết kế với ${i + 2} năm kinh nghiệm`,
                skills: ['Logo Design', 'Branding', 'UI/UX'],
                rating: 4 + Math.random(),
                reviewCount: Math.floor(Math.random() * 50) + 10,
                completedProjects: Math.floor(Math.random() * 100) + 20
            });
            designers.push(designer);
        }
        console.log('✅ Đã tạo 10 nhà thiết kế');

        // Tạo clients
        const clients = [];
        for (let i = 1; i <= 5; i++) {
            const password = await bcrypt.hash('123456', 10);
            const client = await User.create({
                fullName: `Khách Hàng ${i}`,
                email: `client${i}@example.com`,
                password: password,
                userType: 'client',
                status: 'active'
            });
            clients.push(client);
        }
        console.log('✅ Đã tạo 5 khách hàng');

        // Tạo projects
        const projectTitles = [
            'Thiết Kế Logo Công Ty',
            'Thiết Kế UI/UX App Mobile',
            'Thiết Kế Brochure Sản Phẩm',
            'Thiết Kế Banner Quảng Cáo',
            'Thiết Kế Poster Sự Kiện',
            'Thiết Kế Bao Bì Sản Phẩm',
            'Thiết Kế Website Landing Page',
            'Thiết Kế Catalogue',
            'Thiết Kế Menu Nhà Hàng',
            'Thiết Kế Card Visit'
        ];

        const categories = ['logo', 'uiux', 'print', 'branding', 'illustration'];
        const statuses = ['recruiting', 'in_progress', 'completed'];

        const projects = [];
        for (let i = 0; i < 15; i++) {
            const client = clients[Math.floor(Math.random() * clients.length)];
            const designer = Math.random() > 0.3 ? designers[Math.floor(Math.random() * designers.length)] : null;
            const status = designer ? statuses[Math.floor(Math.random() * statuses.length)] : 'recruiting';
            
            const project = await Project.create({
                title: projectTitles[i % projectTitles.length],
                description: `Mô tả chi tiết cho dự án ${projectTitles[i % projectTitles.length]}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                budget: (Math.floor(Math.random() * 20) + 2) * 1000000,
                deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
                client: client._id,
                designer: designer?._id,
                status: status,
                requirements: ['Yêu cầu 1', 'Yêu cầu 2', 'Yêu cầu 3'],
                skills: ['Photoshop', 'Illustrator'],
                progress: status === 'completed' ? 100 : Math.floor(Math.random() * 80)
            });
            projects.push(project);
        }
        console.log('✅ Đã tạo 15 dự án');

        // Tạo transactions
        const completedProjects = projects.filter(p => p.status === 'completed');
        for (const project of completedProjects) {
            if (project.designer) {
                await Transaction.create({
                    project: project._id,
                    from: project.client,
                    to: project.designer,
                    amount: project.budget,
                    status: 'completed',
                    paymentMethod: 'bank_transfer',
                    description: `Thanh toán cho dự án: ${project.title}`,
                    completedAt: new Date()
                });
            }
        }
        console.log('✅ Đã tạo giao dịch');

        console.log('\n🎉 Hoàn tất tạo dữ liệu mẫu!');
        console.log('\n📝 Thông tin đăng nhập:');
        console.log('Admin: admin@designhub.com / admin123');
        console.log('Designer: designer1@example.com / 123456');
        console.log('Client: client1@example.com / 123456');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

seedData();
