const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByStatus,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Public routes
router.get('/', getAllProjects);
router.get('/status/:status', getProjectsByStatus);
router.get('/:id', getProject);

// Protected routes (Admin only)
router.post(
  '/',
  protect,
  upload.single('image'),
  handleMulterError,
  createProject
);

router.put(
  '/:id',
  protect,
  upload.single('image'),
  handleMulterError,
  updateProject
);

router.delete('/:id', protect, deleteProject);

module.exports = router;

