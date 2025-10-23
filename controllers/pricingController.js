const Pricing = require('../models/Pricing');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const { bufferToDataURI } = require('../utils/dataUri');

// @desc    Create new pricing package
// @route   POST /api/pricing
// @access  Private (Admin only)
const createPricing = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      currency,
      duration,
      features, 
      stack,
      category,
      popular,
      buttonText,
      order, 
      isActive 
    } = req.body;

    console.log('📝 Create pricing request received:');
    console.log('Body:', { 
      name, 
      description, 
      price,
      currency,
      duration,
      features: typeof features, 
      stack: typeof stack,
      category,
      popular,
      buttonText,
      order, 
      isActive 
    });
    console.log('File:', req.file ? 'Image uploaded' : 'No image');

    // Parse features FIRST before validation
    let parsedFeatures;
    try {
      parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      console.log('✅ Features parsed:', parsedFeatures);
    } catch (e) {
      console.log('❌ Features parsing failed:', e.message);
      return res.status(400).json({
        success: false,
        error: 'Invalid features format',
      });
    }

    // Parse stack (optional)
    let parsedStack = [];
    if (stack) {
      try {
        parsedStack = typeof stack === 'string' ? JSON.parse(stack) : stack;
        console.log('✅ Stack parsed:', parsedStack);
      } catch (e) {
        console.log('❌ Stack parsing failed:', e.message);
        return res.status(400).json({
          success: false,
          error: 'Invalid stack format',
        });
      }
    }

    // NOW validate required fields (after parsing)
    if (!name || !description || !price || !parsedFeatures || parsedFeatures.length === 0 || !category) {
      console.log('❌ Validation failed - missing required fields');
      console.log('Missing:', { 
        name: !!name, 
        description: !!description, 
        price: !!price,
        features: !!parsedFeatures && parsedFeatures.length > 0,
        category: !!category
      });
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields (name, description, price, features, category)',
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
    const imageData = await uploadImage(dataUri, 'skyweb/pricing');

    // Create pricing package
    const pricingPackage = await Pricing.create({
      name,
      description,
      price: parseFloat(price),
      currency: currency || 'USD',
      duration: duration || 'one-time',
      image: {
        publicId: imageData.publicId,
        url: imageData.url,
      },
      features: parsedFeatures,
      stack: parsedStack,
      category: category.toLowerCase(),
      popular: popular === 'true' || popular === true,
      buttonText: buttonText || 'Get Started',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    console.log('✅ Pricing package created successfully');

    res.status(201).json({
      success: true,
      data: pricingPackage,
    });
  } catch (error) {
    console.error('Error creating pricing package:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Get all pricing packages
// @route   GET /api/pricing
// @access  Public
const getPricingPackages = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const pricingPackages = await Pricing.find(filter)
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pricingPackages.length,
      data: pricingPackages,
    });
  } catch (error) {
    console.error('Error fetching pricing packages:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get single pricing package
// @route   GET /api/pricing/:id
// @access  Public
const getPricingPackage = async (req, res) => {
  try {
    const pricingPackage = await Pricing.findById(req.params.id);

    if (!pricingPackage) {
      return res.status(404).json({
        success: false,
        error: 'Pricing package not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pricingPackage,
    });
  } catch (error) {
    console.error('Error fetching pricing package:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update pricing package
// @route   PUT /api/pricing/:id
// @access  Private (Admin only)
const updatePricing = async (req, res) => {
  try {
    let pricingPackage = await Pricing.findById(req.params.id);

    if (!pricingPackage) {
      return res.status(404).json({
        success: false,
        error: 'Pricing package not found',
      });
    }

    const { 
      name, 
      description, 
      price,
      currency,
      duration,
      features, 
      stack,
      category,
      popular,
      buttonText,
      order, 
      isActive 
    } = req.body;

    console.log('📝 Update pricing request received for ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'New image uploaded' : 'No new image');

    // Parse features if provided
    let parsedFeatures;
    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid features format',
        });
      }
    }

    // Parse stack if provided
    let parsedStack;
    if (stack) {
      try {
        parsedStack = typeof stack === 'string' ? JSON.parse(stack) : stack;
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid stack format',
        });
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (currency) updateData.currency = currency;
    if (duration) updateData.duration = duration;
    if (parsedFeatures) updateData.features = parsedFeatures;
    if (parsedStack !== undefined) updateData.stack = parsedStack;
    if (category) updateData.category = category.toLowerCase();
    if (popular !== undefined) updateData.popular = popular === 'true' || popular === true;
    if (buttonText) updateData.buttonText = buttonText;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary
      if (pricingPackage.image && pricingPackage.image.publicId) {
        try {
          await deleteImage(pricingPackage.image.publicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
          // Continue with update even if deletion fails
        }
      }

      // Upload new image
      const dataUri = bufferToDataURI(req.file.buffer, req.file.mimetype);
      const imageData = await uploadImage(dataUri, 'skyweb/pricing');
      
      updateData.image = {
        publicId: imageData.publicId,
        url: imageData.url,
      };
    }

    pricingPackage = await Pricing.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    console.log('✅ Pricing package updated successfully');

    res.status(200).json({
      success: true,
      data: pricingPackage,
    });
  } catch (error) {
    console.error('Error updating pricing package:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Delete pricing package
// @route   DELETE /api/pricing/:id
// @access  Private (Admin only)
const deletePricing = async (req, res) => {
  try {
    const pricingPackage = await Pricing.findById(req.params.id);

    if (!pricingPackage) {
      return res.status(404).json({
        success: false,
        error: 'Pricing package not found',
      });
    }

    // Delete image from Cloudinary
    if (pricingPackage.image && pricingPackage.image.publicId) {
      try {
        await deleteImage(pricingPackage.image.publicId);
      } catch (error) {
        console.error('Error deleting image:', error);
        // Continue with deletion even if image deletion fails
      }
    }

    await Pricing.findByIdAndDelete(req.params.id);

    console.log('✅ Pricing package deleted successfully');

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting pricing package:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = {
  createPricing,
  getPricingPackages,
  getPricingPackage,
  updatePricing,
  deletePricing,
};

