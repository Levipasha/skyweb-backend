const InternshipEnrollment = require('../models/InternshipEnrollment');
const Internship = require('../models/Internship');

// @desc    Create internship enrollment (Public - from website)
// @route   POST /api/enrollments
// @access  Public
exports.createEnrollment = async (req, res) => {
  try {
    const { internshipId, name, email, phone, resumeLink, coverLetter } = req.body;
    
    // Validate required fields
    if (!internshipId || !name || !email || !resumeLink) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields (internshipId, name, email, resumeLink)',
      });
    }
    
    // Check if internship exists and is active
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        error: 'Internship not found',
      });
    }
    
    if (!internship.isActive) {
      return res.status(400).json({
        success: false,
        error: 'This internship is no longer accepting applications',
      });
    }
    
    // Check if user already applied
    const existingEnrollment = await InternshipEnrollment.findOne({
      internship: internshipId,
      email: email.toLowerCase(),
    });
    
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this internship',
      });
    }
    
    // Create enrollment
    const enrollment = await InternshipEnrollment.create({
      internship: internshipId,
      name,
      email,
      phone,
      resumeLink,
      coverLetter,
    });
    
    // Increment enrollment count
    await Internship.findByIdAndUpdate(internshipId, {
      $inc: { enrollmentCount: 1 },
    });
    
    res.status(201).json({
      success: true,
      data: enrollment,
      message: 'Application submitted successfully! We will review your application and get back to you soon.',
    });
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit application. Please try again.',
    });
  }
};

// @desc    Get all enrollments (Admin)
// @route   GET /api/enrollments
// @access  Private (Admin)
exports.getAllEnrollments = async (req, res) => {
  try {
    const { status, internshipId, limit = 50, page = 1 } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (internshipId) {
      query.internship = internshipId;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const enrollments = await InternshipEnrollment.find(query)
      .populate('internship', 'title duration location')
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

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private (Admin)
exports.getEnrollment = async (req, res) => {
  try {
    const enrollment = await InternshipEnrollment.findById(req.params.id)
      .populate('internship', 'title duration location stipend');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enrollment',
    });
  }
};

// @desc    Update enrollment status
// @route   PUT /api/enrollments/:id
// @access  Private (Admin)
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Please provide status',
      });
    }
    
    const enrollment = await InternshipEnrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('internship', 'title');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: enrollment,
      message: 'Enrollment status updated successfully',
    });
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update enrollment status',
    });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private (Admin)
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await InternshipEnrollment.findById(req.params.id);
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }
    
    // Decrement enrollment count
    await Internship.findByIdAndUpdate(enrollment.internship, {
      $inc: { enrollmentCount: -1 },
    });
    
    await enrollment.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
    });
  } catch (error) {
    console.error('Delete enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete enrollment',
    });
  }
};

// @desc    Get enrollment statistics
// @route   GET /api/enrollments/stats
// @access  Private (Admin)
exports.getEnrollmentStats = async (req, res) => {
  try {
    const stats = await InternshipEnrollment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const total = await InternshipEnrollment.countDocuments();
    
    const formattedStats = {
      total,
      byStatus: {},
    };
    
    stats.forEach(stat => {
      formattedStats.byStatus[stat._id] = stat.count;
    });
    
    res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
    });
  }
};

