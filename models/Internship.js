const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Image URL is required'],
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    certificate: {
      type: Boolean,
      default: true,
    },
    stipend: {
      type: String,
      default: 'Unpaid',
      trim: true,
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    skillsRequired: [{
      type: String,
      trim: true,
    }],
    responsibilities: [{
      type: String,
      trim: true,
    }],
    eligibility: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    applicationDeadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
internshipSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Internship', internshipSchema);

