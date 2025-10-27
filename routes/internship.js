const express = require('express');
const router = express.Router();
const {
  getAllInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getInternshipEnrollments,
} = require('../controllers/internshipController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', getAllInternships);
router.get('/:id', getInternship);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), createInternship);
router.put('/:id', protect, upload.single('image'), updateInternship);
router.delete('/:id', protect, deleteInternship);
router.get('/:id/enrollments', protect, getInternshipEnrollments);

module.exports = router;

