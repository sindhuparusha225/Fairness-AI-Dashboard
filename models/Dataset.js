const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    authors: {
      type: String,
      required: [true, 'Authors are required'],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      maxlength: [5000, 'Abstract cannot exceed 5000 characters'],
    },
    publicationYear: {
      type: Number,
      required: [true, 'Publication year is required'],
      min: [1990, 'Year must be 1990 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    datasetSize: {
      type: Number,
      required: [true, 'Dataset size is required'],
      min: [1, 'Dataset size must be at least 1'],
    },
    // Age distribution percentages
    ageDistribution: {
      age18_30: { type: Number, default: 0, min: 0, max: 100 },
      age31_45: { type: Number, default: 0, min: 0, max: 100 },
      age46_85: { type: Number, default: 0, min: 0, max: 100 },
    },
    // Gender distribution percentages
    genderDistribution: {
      male: { type: Number, default: 0, min: 0, max: 100 },
      female: { type: Number, default: 0, min: 0, max: 100 },
      other: { type: Number, default: 0, min: 0, max: 100 },
    },
    // Fitzpatrick skin tone distribution percentages
    skinToneDistribution: {
      typeI: { type: Number, default: 0, min: 0, max: 100 },
      typeII: { type: Number, default: 0, min: 0, max: 100 },
      typeIII: { type: Number, default: 0, min: 0, max: 100 },
      typeIV: { type: Number, default: 0, min: 0, max: 100 },
      typeV: { type: Number, default: 0, min: 0, max: 100 },
      typeVI: { type: Number, default: 0, min: 0, max: 100 },
    },
    // Lighting conditions
    lightingCondition: {
      bright: { type: Number, default: 0, min: 0, max: 100 },
      dark: { type: Number, default: 0, min: 0, max: 100 },
    },
    // File paths
    paperFile: {
      type: String,
      default: null,
    },
    datasetFile: {
      type: String,
      default: null,
    },
    // Metadata
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['active', 'archived', 'under_review'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Text index for search
datasetSchema.index({ title: 'text', authors: 'text', abstract: 'text' });

module.exports = mongoose.model('Dataset', datasetSchema);
