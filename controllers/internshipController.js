const Internship = require('../models/Internship');
const InternshipEnrollment = require('../models/InternshipEnrollment');
const { cloudinary } = require('../config/cloudinary');
const { bufferToDataURI } = require('../utils/dataUri');

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
exports.getAllInternships = async (req, res) => {
  try {
    const { isActive, search, limit = 10, page = 1 } = req.query;
    
    const query = {};
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Internship.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: internships,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch internships',
    });
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
exports.getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        error: 'Internship not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch internship',
    });
  }
};

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Admin)
exports.createInternship = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      certificate,
      stipend,
      location,
      skillsRequired,
      responsibilities,
      eligibility,
      startDate,
      applicationDeadline,
      isActive,
    } = req.body;
    
    // Check if image is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image',
      });
    }
    
    // Upload image to Cloudinary
    const fileData = bufferToDataURI(req.file.buffer, req.file.mimetype);
    const result = await cloudinary.uploader.upload(fileData, {
      folder: 'skyweb/internships',
      resource_type: 'auto',
    });
    
    // Create internship
    const internship = await Internship.create({
      title,
      description,
      duration,
      certificate: certificate === 'true' || certificate === true,
      stipend,
      location,
      skillsRequired: Array.isArray(skillsRequired) 
        ? skillsRequired 
        : skillsRequired ? JSON.parse(skillsRequired) : [],
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : responsibilities ? JSON.parse(responsibilities) : [],
      eligibility,
      startDate,
      applicationDeadline,
      isActive: isActive === 'true' || isActive === true,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
    
    res.status(201).json({
      success: true,
      data: internship,
      message: 'Internship created successfully',
    });
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create internship',
    });
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Admin)
exports.updateInternship = async (req, res) => {
  try {
    let internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        error: 'Internship not found',
      });
    }
    
    const {
      title,
      description,
      duration,
      certificate,
      stipend,
      location,
      skillsRequired,
      responsibilities,
      eligibility,
      startDate,
      applicationDeadline,
      isActive,
    } = req.body;
    
    const updateData = {
      title,
      description,
      duration,
      certificate: certificate === 'true' || certificate === true,
      stipend,
      location,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired ? JSON.parse(skillsRequired) : internship.skillsRequired,
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : responsibilities ? JSON.parse(responsibilities) : internship.responsibilities,
      eligibility,
      startDate,
      applicationDeadline,
      isActive: isActive === 'true' || isActive === true,
    };
    
    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (internship.image?.publicId) {
        await cloudinary.uploader.destroy(internship.image.publicId);
      }
      
      // Upload new image
      const fileData = bufferToDataURI(req.file.buffer, req.file.mimetype);
      const result = await cloudinary.uploader.upload(fileData, {
        folder: 'skyweb/internships',
        resource_type: 'auto',
      });
      
      updateData.image = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }
    
    internship = await Internship.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: internship,
      message: 'Internship updated successfully',
    });
  } catch (error) {
    console.error('Update internship error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update internship',
    });
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Admin)
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        error: 'Internship not found',
      });
    }
    
    // Delete image from Cloudinary
    if (internship.image?.publicId) {
      await cloudinary.uploader.destroy(internship.image.publicId);
    }
    
    // Delete all enrollments for this internship
    await InternshipEnrollment.deleteMany({ internship: req.params.id });
    
    await internship.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error) {
    console.error('Delete internship error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete internship',
    });
  }
};

// @desc    Get internship enrollments
// @route   GET /api/internships/:id/enrollments
// @access  Private (Admin)
exports.getInternshipEnrollments = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    const query = { internship: req.params.id };
    
    if (status) {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const enrollments = await InternshipEnrollment.find(query)
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await InternshipEnrollment.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: enrollments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enrollments',
    });
  }
};

