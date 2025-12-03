const mongoose = require('mongoose');

const substanceSchema = new mongoose.Schema({
    substanceId: String,
    instruction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instruction',
      required: true
    },
    unNumber: String,
    nameBg: String,
    nameEn: String,
    description: String,
    polimerization: Boolean,
    reactsWithWater: Boolean,
    reactionProduct: String,
    hazardClass: String,
    hazardSubclass: String,
    dangerNumber: String,
    version: Number
  });

const Substance = 
  mongoose.model('Substance', substanceSchema);

module.exports = Substance;