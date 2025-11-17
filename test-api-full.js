// Script test toàn bộ API
const API_URL = 'http://localhost:3000/api';

console.log('🧪 BẮT ĐẦU TEST API...\n');

// Test 1: Kiểm tra server
async function testServer() {
    console.log('1️⃣ Test Server...');
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            console.log('✅ Server hoạt động tốt!');
            console.log(`   Message: ${data.message}\n`);
            return true;
        } else {
            console.log('❌ Server có vấn đề!\n');
            return false;
        }
    } catch (error) {
        console.log('❌ Không thể kết nối server!');
        console.log(`   Lỗi: ${error.message}\n`);
        return false;
    }
}

// Test 2: Đăng ký user
async function testRegister() {
    console.log('2️⃣ Test Đăng Ký...');
    const testData = {
        fullName: 'Test User ' + Date.now(),
        email: 'test_' + Date.now() + '@example.com',
        password: '123456',
        userType: 'client'
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Đăng ký thành công!');
            console.log(`   Email: ${testData.email}`);
            console.log(`   User ID: ${data.userId}\n`);
            return { success: true, email: testData.email, password: testData.password };
        } else {
            console.log('❌ Đăng ký thất bại!');
            console.log(`   Lỗi: ${data.message}\n`);
            return { success: false };
        }
    } catch (error) {
        console.log('❌ Lỗi kết nối!');
        console.log(`   Lỗi: ${error.message}\n`);
        return { success: false };
    }
}

// Test 3: Đăng nhập
async function testLogin(email, password) {
    console.log('3️⃣ Test Đăng Nhập...');
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Đăng nhập thành công!');
            console.log(`   Token: ${data.token.substring(0, 20)}...`);
            console.log(`   User: ${data.user.fullName}\n`);
            return { success: true, token: data.token };
        } else {
            console.log('❌ Đăng nhập thất bại!');
            console.log(`   Lỗi: ${data.message}\n`);
            return { success: false };
        }
    } catch (error) {
        console.log('❌ Lỗi kết nối!');
        console.log(`   Lỗi: ${error.message}\n`);
        return { success: false };
    }
}

// Chạy tất cả tests
async function runAllTests() {
    console.log('═══════════════════════════════════════════════════');
    console.log('           🧪 TEST API DESIGNHUB                   ');
    console.log('═══════════════════════════════════════════════════\n');

    // Test 1: Server
    const serverOk = await testServer();
    if (!serverOk) {
        console.log('❌ Server không hoạt động. Dừng test.\n');
        console.log('💡 Giải pháp:');
        console.log('   1. Chạy: node server.js');
        console.log('   2. Đợi thông báo "Server đang chạy"');
        console.log('   3. Chạy lại script này\n');
        return;
    }

    // Test 2: Đăng ký
    const registerResult = await testRegister();
    if (!registerResult.success) {
        console.log('❌ Đăng ký thất bại. Dừng test.\n');
        return;
    }

    // Test 3: Đăng nhập
    const loginResult = await testLogin(registerResult.email, registerResult.password);
    if (!loginResult.success) {
        console.log('❌ Đăng nhập thất bại.\n');
        return;
    }

    // Kết quả
    console.log('═══════════════════════════════════════════════════');
    console.log('           ✅ TẤT CẢ TEST THÀNH CÔNG!             ');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('🎉 API hoạt động hoàn hảo!');
    console.log('📝 Bạn có thể sử dụng các trang sau:');
    console.log('   - http://localhost:3000/register.html');
    console.log('   - http://localhost:3000/login.html');
    console.log('   - http://localhost:3000/admin-register.html\n');
}

// Chạy
runAllTests().catch(error => {
    console.error('❌ Lỗi nghiêm trọng:', error);
});
