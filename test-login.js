const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@skyweb.com';
    const password = 'Admin@123';

    console.log('\n🔍 Testing login with:');
    console.log('Email:', email);
    console.log('Password:', password);

    // Find admin
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      console.log('\n❌ Admin not found!');
      process.exit(1);
    }

    console.log('\n✅ Admin found:');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);

    // Test password
    const isMatch = await admin.comparePassword(password);
    
    if (isMatch) {
      console.log('\n✅ Password matches! Login should work.');
    } else {
      console.log('\n❌ Password does NOT match!');
      console.log('\n💡 Solution: Delete admin and recreate:');
      console.log('1. Delete the admin from MongoDB');
      console.log('2. Run: npm run seed:admin');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();

