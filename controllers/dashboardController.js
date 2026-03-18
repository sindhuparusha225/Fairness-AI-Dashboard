const User = require('../models/User');
const Dataset = require('../models/Dataset');
const Evaluation = require('../models/Evaluation');

exports.getDashboard = async (req, res) => {
  try {
    const [
      totalDatasets,
      totalResearchers,
      totalEvaluations,
      recentDatasets,
      recentEvaluations,
    ] = await Promise.all([
      Dataset.countDocuments({ status: 'active' }),
      User.countDocuments({ isActive: true }),
      Evaluation.countDocuments(),
      Dataset.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('uploadedBy', 'name'),
      Evaluation.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('evaluatedBy', 'name')
        .populate('dataset', 'title'),
    ]);

    // Total samples
    const sampleAgg = await Dataset.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, totalSamples: { $sum: '$datasetSize' } } },
    ]);
    const totalSamples = sampleAgg.length > 0 ? sampleAgg[0].totalSamples : 0;

    // Dataset Aggregations
    const ageAgg = await Dataset.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          age18_30: { $avg: '$ageDistribution.age18_30' },
          age31_45: { $avg: '$ageDistribution.age31_45' },
          age46_85: { $avg: '$ageDistribution.age46_85' },
        },
      },
    ]);

    const genderAgg = await Dataset.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          male: { $avg: '$genderDistribution.male' },
          female: { $avg: '$genderDistribution.female' },
          other: { $avg: '$genderDistribution.other' },
        },
      },
    ]);

    const skinAgg = await Dataset.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          typeI: { $avg: '$skinToneDistribution.typeI' },
          typeII: { $avg: '$skinToneDistribution.typeII' },
          typeIII: { $avg: '$skinToneDistribution.typeIII' },
          typeIV: { $avg: '$skinToneDistribution.typeIV' },
          typeV: { $avg: '$skinToneDistribution.typeV' },
          typeVI: { $avg: '$skinToneDistribution.typeVI' },
        },
      },
    ]);

    const lightingAgg = await Dataset.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          bright: { $avg: '$lightingCondition.bright' },
          dark: { $avg: '$lightingCondition.dark' },
        },
      },
    ]);

    // Default (dataset-based)
    let ageData = ageAgg[0] || {
      age18_30: 35.6,
      age31_45: 32.5,
      age46_85: 29.8,
    };

    let genderData = genderAgg[0] || {
      male: 43.4,
      female: 54.5,
      other: 0.1,
    };

    let skinData = skinAgg[0] || {
      typeI: 4.0,
      typeII: 28.3,
      typeIII: 22.9,
      typeIV: 8.4,
      typeV: 15.8,
      typeVI: 20.7,
    };

    let lightingData = lightingAgg[0] || {
      bright: 85.1,
      dark: 14.9,
    };

    // 🔥 OVERRIDE WITH LATEST EVALUATION (KEY FIX)
    const latestEval = await Evaluation.findOne().sort({ createdAt: -1 });

    if (latestEval) {
      ageData = {
        age18_30: latestEval.ageMetrics.age18_30.accuracy,
        age31_45: latestEval.ageMetrics.age31_45.accuracy,
        age46_85: latestEval.ageMetrics.age46_85.accuracy,
      };

      genderData = {
        male: latestEval.genderMetrics.male.accuracy,
        female: latestEval.genderMetrics.female.accuracy,
        other: latestEval.genderMetrics.other.accuracy,
      };

      skinData = {
        typeI: latestEval.skinToneMetrics.typeI.accuracy,
        typeII: latestEval.skinToneMetrics.typeII.accuracy,
        typeIII: latestEval.skinToneMetrics.typeIII.accuracy,
        typeIV: latestEval.skinToneMetrics.typeIV.accuracy,
        typeV: latestEval.skinToneMetrics.typeV.accuracy,
        typeVI: latestEval.skinToneMetrics.typeVI.accuracy,
      };

      lightingData = {
        bright: latestEval.lightingMetrics.bright.accuracy,
        dark: latestEval.lightingMetrics.dark.accuracy,
      };
    }

    res.render('dashboard/index', {
      title: 'Research Dashboard',
      stats: {
        totalDatasets,
        totalResearchers,
        totalSamples,
        totalEvaluations,
      },
      chartData: {
        age: ageData,
        gender: genderData,
        skinTone: skinData,
        lighting: lightingData,
      },
      recentDatasets,
      recentEvaluations,
    });
  } catch (err) {
    console.error('Dashboard error:', err);

    res.render('dashboard/index', {
      title: 'Research Dashboard',
      stats: {
        totalDatasets: 0,
        totalResearchers: 0,
        totalSamples: 0,
        totalEvaluations: 0,
      },
      chartData: {
        age: { age18_30: 35.6, age31_45: 32.5, age46_85: 29.8 },
        gender: { male: 43.4, female: 54.5, other: 2.1 },
        skinTone: {
          typeI: 4.0,
          typeII: 28.3,
          typeIII: 22.9,
          typeIV: 8.4,
          typeV: 15.8,
          typeVI: 20.7,
        },
        lighting: { bright: 85.1, dark: 14.9 },
      },
      recentDatasets: [],
      recentEvaluations: [],
    });
  }
};