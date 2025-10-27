const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

/**
 * @desc    Register a new admin (Super admin only or first-time setup)
 * @route   POST /api/auth/register
 * @access  Public (for first admin) / Private (for subsequent admins)
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
    }

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        error: 'Admin already exists with this email',
      });
    }

    // Check if this is the first admin
    const adminCount = await Admin.countDocuments();
    const role = adminCount === 0 ? 'super-admin' : 'admin';

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
      role,
    });

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration',
    });
  }
};

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    // Trim inputs to remove any accidental spaces
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    
    // DEBUG: Log what we received
    console.log('🔍 Login attempt:');
    console.log('Email:', email);
    console.log('Password received:', password ? '***' : 'EMPTY');

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Find admin with password field
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      console.log('❌ Admin not found with email:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    
    console.log('✅ Admin found:', admin.email);

    // Check if admin is active
    if (!admin.isActive) {
      console.log('❌ Admin account is deactivated');
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact super admin.',
      });
    }

    // Check password
    console.log('🔐 Comparing password...');
    const isMatch = await admin.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }
    
    console.log('✅ Login successful!');

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login',
    });
  }
};

/**
 * @desc    Get current logged in admin
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

/**
 * @desc    Update admin password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password',
      });
    }

    // Get admin with password
    const admin = await Admin.findById(req.admin._id).select('+password');

    // Check current password
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    // Generate new token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      data: {
        message: 'Password updated successfully',
        token,
      },
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePassword,
};

