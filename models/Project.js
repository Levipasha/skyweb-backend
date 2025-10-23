const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide project description'],
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Please provide image URL'],
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    tags: {
      type: [String],
      required: [true, 'Please provide at least one tag'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one tag is required',
      },
    },
    projectUrl: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['completed', 'ongoing', 'upcoming'],
      default: 'ongoing',
      required: true,
    },
    category: {
      type: String,
      enum: ['website', 'app', 'e-commerce', 'dashboard', 'other'],
      default: 'other',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering and ordering
projectSchema.index({ status: 1, order: 1 });
projectSchema.index({ category: 1 });

module.exports = mongoose.model('Project', projectSchema);

