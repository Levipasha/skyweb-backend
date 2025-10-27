const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a package name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'INR', 'GBP'],
  },
  duration: {
    type: String,
    default: 'one-time',
    enum: ['one-time', 'monthly', 'yearly'],
  },
  image: {
    publicId: {
      type: String,
      required: [true, 'Image public ID is required'],
    },
    url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
  },
  features: {
    type: [{
      text: {
        type: String,
        required: true,
      },
      included: {
        type: Boolean,
        default: true,
      }
    }],
    required: [true, 'Please add at least one feature'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one feature is required',
    },
  },
  stack: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['web', 'mobile', 'full-stack', 'e-commerce', 'custom', 'consulting'],
    lowercase: true,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: 'Get Started',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for sorting
pricingSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('Pricing', pricingSchema);

