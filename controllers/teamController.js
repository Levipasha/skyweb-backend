const Team = require('../models/Team');
const { uploadImage, deleteImage, updateImage } = require('../config/cloudinary');
const { bufferToDataURI } = require('../utils/dataUri');

/**
 * @desc    Get all team members
 * @route   GET /api/teams
 * @access  Public
 */
const getAllTeamMembers = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 100 } = req.query;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const teamMembers = await Team.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Team.countDocuments(query);

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      total,
      data: teamMembers,
    });
  } catch (error) {
    console.error('Get all team members error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

/**
 * @desc    Get single team member
 * @route   GET /api/teams/:id
 * @access  Public
 */
const getTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

/**
 * @desc    Create team member
 * @route   POST /api/teams
 * @access  Private (Admin)
 */
const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, skills, social, order, isActive } = req.body;

    console.log('📝 Create team request received:');
    console.log('Body:', { name, role, bio, skills: typeof skills, social: typeof social, order, isActive });
    console.log('File:', req.file ? 'Image uploaded' : 'No image');

    // Parse skills FIRST before validation
    let parsedSkills;
    try {
      parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      console.log('✅ Skills parsed:', parsedSkills);
    } catch (e) {
      console.log('❌ Skills parsing failed:', e.message);
      return res.status(400).json({
        success: false,
        error: 'Invalid skills format',
      });
    }

    // Parse social FIRST before validation
    let parsedSocial;
    try {
      parsedSocial = typeof social === 'string' ? JSON.parse(social) : social;
      console.log('✅ Social parsed:', parsedSocial);
    } catch (e) {
      console.log('❌ Social parsing failed:', e.message);
      return res.status(400).json({
        success: false,
        error: 'Invalid social links format',
      });
    }

    // NOW validate required fields (after parsing)
    if (!name || !role || !bio || !parsedSkills || !parsedSocial?.email) {
      console.log('❌ Validation failed - missing required fields');
      console.log('Missing:', { name: !!name, role: !!role, bio: !!bio, skills: !!parsedSkills, email: !!parsedSocial?.email });
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields',
      });
    }

    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image',
      });
    }

    // Convert buffer to data URI
    const dataUri = bufferToDataURI(req.file.buffer, req.file.mimetype);

    // Upload to Cloudinary
    const imageData = await uploadImage(dataUri, 'skyweb/team');

    // Create team member
    const teamMember = await Team.create({
      name,
      role,
      bio,
      skills: parsedSkills,
      social: parsedSocial,
      image: imageData,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Update team member
 * @route   PUT /api/teams/:id
 * @access  Private (Admin)
 */
const updateTeamMember = async (req, res) => {
  try {
    let teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found',
      });
    }

    const { name, role, bio, skills, social, order, isActive } = req.body;

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (bio) updateData.bio = bio;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Parse and update skills if provided
    if (skills) {
      updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }

    // Parse and update social if provided
    if (social) {
      updateData.social = typeof social === 'string' ? JSON.parse(social) : social;
    }

    // Handle image update if new image is uploaded
    if (req.file) {
      const dataUri = bufferToDataURI(req.file.buffer, req.file.mimetype);
      const imageData = await updateImage(
        teamMember.image.publicId,
        dataUri,
        'skyweb/team'
      );
      updateData.image = imageData;
    }

    // Update team member
    teamMember = await Team.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Delete team member
 * @route   DELETE /api/teams/:id
 * @access  Private (Admin)
 */
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found',
      });
    }

    // Delete image from Cloudinary
    await deleteImage(teamMember.image.publicId);

    // Delete team member from database
    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = {
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};

