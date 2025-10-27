const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getAllEnrollments,
  getEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
  getEnrollmentStats,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

// Public route - anyone can apply
router.post('/', createEnrollment);

// Protected routes (Admin only)
router.get('/', protect, getAllEnrollments);
router.get('/stats', protect, getEnrollmentStats);
router.get('/:id', protect, getEnrollment);
router.put('/:id', protect, updateEnrollmentStatus);
router.delete('/:id', protect, deleteEnrollment);

module.exports = router;

