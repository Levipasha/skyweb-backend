const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide team member name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide role'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Please provide bio'],
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
    skills: {
      type: [String],
      required: [true, 'Please provide at least one skill'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one skill is required',
      },
    },
    social: {
      linkedin: {
        type: String,
        default: '',
      },
      github: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      behance: {
        type: String,
        default: '',
      },
      instagram: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email',
        ],
      },
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

// Index for ordering
teamSchema.index({ order: 1 });

module.exports = mongoose.model('Team', teamSchema);

