const Dataset = require('../models/Dataset');
const Evaluation = require('../models/Evaluation');

// ================= DATASETS =================

// GET ALL DATASETS
exports.index = async (req, res) => {
  const datasets = await Dataset.find().populate('uploadedBy', 'name');
  res.render('datasets/index', { datasets });
};

// NEW FORM
exports.newForm = (req, res) => {
  res.render('datasets/new');
};

// CREATE
exports.create = async (req, res) => {
  const dataset = new Dataset({
    ...req.body,
    uploadedBy: req.user._id,
  });

  await dataset.save();
  req.flash('success_msg', 'Dataset created');
  res.redirect('/datasets');
};

// SHOW
exports.show = async (req, res) => {
  const dataset = await Dataset.findById(req.params.id)
    .populate('uploadedBy', 'name');

  res.render('datasets/show', { dataset });
};

// EDIT FORM
exports.editForm = async (req, res) => {
  const dataset = await Dataset.findById(req.params.id);
  res.render('datasets/edit', { dataset });
};

// UPDATE
exports.update = async (req, res) => {
  await Dataset.findByIdAndUpdate(req.params.id, req.body);
  req.flash('success_msg', 'Dataset updated');
  res.redirect(`/datasets/${req.params.id}`);
};

// DELETE
exports.destroy = async (req, res) => {
  await Dataset.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Dataset deleted');
  res.redirect('/datasets');
};

// ================= EVALUATION =================

// SHOW FORM
exports.newEvaluationForm = async (req, res) => {
  const dataset = await Dataset.findById(req.params.id);
  res.render('datasets/evaluation', { dataset });
};

// ADD EVALUATION
exports.addEvaluation = async (req, res) => {
  try {
    await Evaluation.create({
      title: req.body.title,
      modelName: req.body.modelName,
      dataset: req.params.id,
      evaluatedBy: req.user._id,
      description: req.body.description,
      overallAccuracy: Number(req.body.overallAccuracy) || 0,

      ageMetrics: {
        age18_30: {
          accuracy: Number(req.body.ageAcc18_30) || 0,
          falsePositiveRate: Number(req.body.ageFpr18_30) || 0,
          falseNegativeRate: Number(req.body.ageFnr18_30) || 0,
        },
        age31_45: {
          accuracy: Number(req.body.ageAcc31_45) || 0,
          falsePositiveRate: Number(req.body.ageFpr31_45) || 0,
          falseNegativeRate: Number(req.body.ageFnr31_45) || 0,
        },
        age46_85: {
          accuracy: Number(req.body.ageAcc46_85) || 0,
          falsePositiveRate: Number(req.body.ageFpr46_85) || 0,
          falseNegativeRate: Number(req.body.ageFnr46_85) || 0,
        },
      },

      genderMetrics: {
        male: {
          accuracy: Number(req.body.genderAccMale) || 0,
          falsePositiveRate: Number(req.body.genderFprMale) || 0,
        },
        female: {
          accuracy: Number(req.body.genderAccFemale) || 0,
          falsePositiveRate: Number(req.body.genderFprFemale) || 0,
        },
        other: {
          accuracy: Number(req.body.genderAccOther) || 0,
          falsePositiveRate: Number(req.body.genderFprOther) || 0,
        },
      },

      skinToneMetrics: {
        typeI: {
          accuracy: Number(req.body.skinAccI) || 0,
          falsePositiveRate: Number(req.body.skinFprI) || 0,
        },
        typeII: {
          accuracy: Number(req.body.skinAccII) || 0,
          falsePositiveRate: Number(req.body.skinFprII) || 0,
        },
        typeIII: {
          accuracy: Number(req.body.skinAccIII) || 0,
          falsePositiveRate: Number(req.body.skinFprIII) || 0,
        },
        typeIV: {
          accuracy: Number(req.body.skinAccIV) || 0,
          falsePositiveRate: Number(req.body.skinFprIV) || 0,
        },
        typeV: {
          accuracy: Number(req.body.skinAccV) || 0,
          falsePositiveRate: Number(req.body.skinFprV) || 0,
        },
        typeVI: {
          accuracy: Number(req.body.skinAccVI) || 0,
          falsePositiveRate: Number(req.body.skinFprVI) || 0,
        },
      },

      lightingMetrics: {
        bright: {
          accuracy: Number(req.body.lightAccBright) || 0,
          falsePositiveRate: Number(req.body.lightFprBright) || 0,
        },
        dark: {
          accuracy: Number(req.body.lightAccDark) || 0,
          falsePositiveRate: Number(req.body.lightFprDark) || 0,
        },
      },
    });

    req.flash('success_msg', 'Evaluation added successfully');
    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to add evaluation');
    res.redirect('back');
  }
};