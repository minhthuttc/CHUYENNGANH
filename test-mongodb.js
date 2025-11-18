const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Kiểm tra kết nối MongoDB...');
console.log('📍 URI:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));

const testConnection = async () => {
  try {
    console.log('⏳ Đang kết nối...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000
    });
    
    console.log('✅ Kết nối MongoDB thành công!');
    console.log('📊 Database:', conn.connection.db.databaseName);
    console.log('🔗 Host:', conn.connection.host);
    console.log('📡 Port:', conn.connection.port);
    console.log('🔐 ReadyState:', conn.connection.readyState);
    
    // Test tạo collection
    const testCollection = conn.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Test write thành công!');
    
    // Xóa test data
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Test delete thành công!');
    
    console.log('🎉 MongoDB hoạt động hoàn hảo!');
    
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:');
    console.error('📝 Chi tiết:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('🌐 Lỗi DNS - Kiểm tra internet');
    } else if (error.message.includes('authentication failed')) {
      console.log('🔑 Lỗi xác thực - Kiểm tra username/password');
    } else if (error.message.includes('IP')) {
      console.log('🚫 Lỗi IP whitelist - Thêm IP vào MongoDB Atlas');
    } else if (error.message.includes('timeout')) {
      console.log('⏰ Lỗi timeout - Kiểm tra kết nối mạng');
    }
    
    console.log('\n🔧 Hướng dẫn sửa lỗi:');
    console.log('1. Vào MongoDB Atlas: https://cloud.mongodb.com');
    console.log('2. Chọn Network Access');
    console.log('3. Add IP Address -> Allow Access from Anywhere');
    console.log('4. Đợi 1-2 phút rồi thử lại');
  } finally {
    await mongoose.disconnect();
    console.log('👋 Đã ngắt kết nối');
    process.exit(0);
  }
};

testConnection();