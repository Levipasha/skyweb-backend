const express = require('express');
const router = express.Router();
const {
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Public routes
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMember);

// Protected routes (Admin only)
router.post(
  '/',
  protect,
  upload.single('image'),
  handleMulterError,
  createTeamMember
);

router.put(
  '/:id',
  protect,
  upload.single('image'),
  handleMulterError,
  updateTeamMember
);

router.delete('/:id', protect, deleteTeamMember);

module.exports = router;

