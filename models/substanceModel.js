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
    isToxic: Boolean,
    smallSpillInitialIsolationDistance: {
      type: mongoose.Schema.Types.Decimal128,
      get: v => {
        return "122";
      }
    },
    smallSpillProtectiveActionDayDistance: {
      type: mongoose.Schema.Types.Decimal128
    },
    smallSpillProtectiveActionNightDistance: {
      type: mongoose.Schema.Types.Decimal128
    },
    largeSpillInitialIsolationDistance: {
      type: mongoose.Schema.Types.Decimal128
    },
    largeSpillProtectiveActionDayDistance: {
      type: mongoose.Schema.Types.Decimal128
    },
    largeSpillProtectiveActionNightDistance: {
      type: mongoose.Schema.Types.Decimal128
    },
    version: Number
  });

const Substance = 
  mongoose.model('Substance', substanceSchema);

module.exports = Substance;