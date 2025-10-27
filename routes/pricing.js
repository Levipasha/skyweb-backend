const express = require('express');
const {
  createPricing,
  getPricingPackages,
  getPricingPackage,
  updatePricing,
  deletePricing,
} = require('../controllers/pricingController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getPricingPackages);
router.get('/:id', getPricingPackage);

// Protected routes (Admin only)
router.post(
  '/',
  protect,
  authorize('admin', 'super-admin'),
  upload.single('image'),
  createPricing
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'super-admin'),
  upload.single('image'),
  updatePricing
);

router.delete(
  '/:id',
  protect,
  authorize('admin', 'super-admin'),
  deletePricing
);

module.exports = router;

