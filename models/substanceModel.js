const mongoose = require('mongoose');

const substanceSchema = new mongoose.Schema({
    substanceId: String,
    instruction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instruction',
      required: true
    },
    unNumber: Number,
    nameBg: String,
    nameEn: String,
    description: String,
    reactsWithWater: Boolean,
    reactionProduct: String,
    hazardClass: String,
    hazardSubclass: String,
    dangerNumber: String,
    version: Number
  });

const Instruction = 
  mongoose.model('Substance', substanceSchema);

module.exports = Substance;