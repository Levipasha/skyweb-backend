const Project = require('../models/Project');
const { uploadImage, deleteImage, updateImage } = require('../config/cloudinary');
const { bufferToDataURI } = require('../utils/dataUri');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
const getAllProjects = async (req, res) => {
  try {
    const { status, category, isActive, page = 1, limit = 100 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      data: projects,
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      projectUrl,
      status,
      category,
      order,
      isActive,
    } = req.body;

    // Validate required fields
    if (!title || !description || !tags) {
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
    const imageData = await uploadImage(dataUri, 'skyweb/projects');

    // Parse tags if it's a string
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    // Create project
    const project = await Project.create({
      title,
      description,
      tags: parsedTags,
      projectUrl: projectUrl || '',
      status: status || 'ongoing',
      category: category || 'other',
      image: imageData,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin)
 */
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    const {
      title,
      description,
      tags,
      projectUrl,
      status,
      category,
      order,
      isActive,
    } = req.body;

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (projectUrl !== undefined) updateData.projectUrl = projectUrl;
    if (status) updateData.status = status;
    if (category) updateData.category = category;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Parse and update tags if provided
    if (tags) {
      updateData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }

    // Handle image update if new image is uploaded
    if (req.file) {
      const dataUri = bufferToDataURI(req.file.buffer, req.file.mimetype);
      const imageData = await updateImage(
        project.image.publicId,
        dataUri,
        'skyweb/projects'
      );
      updateData.image = imageData;
    }

    // Update project
    project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    // Delete image from Cloudinary
    await deleteImage(project.image.publicId);

    // Delete project from database
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

/**
 * @desc    Get projects by status
 * @route   GET /api/projects/status/:status
 * @access  Public
 */
const getProjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 100 } = req.query;

    const skip = (page - 1) * limit;

    const projects = await Project.find({ status, isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Project.countDocuments({ status, isActive: true });

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects by status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByStatus,
};

