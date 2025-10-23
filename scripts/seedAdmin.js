/**
 * Script to create the first admin user
 * Run with: node scripts/seedAdmin.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyweb');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@skyweb.com' 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists with this email');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@skyweb.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'super-admin',
    });

    console.log('✅ Admin created successfully!');
    console.log('==================================');
    console.log('Email:', admin.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin@123');
    console.log('Role:', admin.role);
    console.log('==================================');
    console.log('⚠️  Please change your password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();

