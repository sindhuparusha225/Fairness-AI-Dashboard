const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    modelName: { type: String, required: true },
    dataset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dataset',
      required: true,
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: String,

    ageMetrics: {
      age18_30: {
        accuracy: Number,
        falsePositiveRate: Number,
        falseNegativeRate: Number,
      },
      age31_45: {
        accuracy: Number,
        falsePositiveRate: Number,
        falseNegativeRate: Number,
      },
      age46_85: {
        accuracy: Number,
        falsePositiveRate: Number,
        falseNegativeRate: Number,
      },
    },

    genderMetrics: {
      male: { accuracy: Number, falsePositiveRate: Number },
      female: { accuracy: Number, falsePositiveRate: Number },
      other: { accuracy: Number, falsePositiveRate: Number },
    },

    skinToneMetrics: {
      typeI: { accuracy: Number, falsePositiveRate: Number },
      typeII: { accuracy: Number, falsePositiveRate: Number },
      typeIII: { accuracy: Number, falsePositiveRate: Number },
      typeIV: { accuracy: Number, falsePositiveRate: Number },
      typeV: { accuracy: Number, falsePositiveRate: Number },
      typeVI: { accuracy: Number, falsePositiveRate: Number },
    },

    lightingMetrics: {
      bright: { accuracy: Number, falsePositiveRate: Number },
      dark: { accuracy: Number, falsePositiveRate: Number },
    },

    overallAccuracy: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Evaluation', evaluationSchema);