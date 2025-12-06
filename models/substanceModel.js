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
    smallSpillInitialIsolationDistance: mongoose.Schema.Types.Decimal128,
    smallSpillProtectiveActionDayDistance: mongoose.Schema.Types.Decimal128,
    smallSpillProtectiveActionNightDistance: mongoose.Schema.Types.Decimal128,
    largeSpillInitialIsolationDistance: mongoose.Schema.Types.Decimal128,
    largeSpillProtectiveActionDayDistance: mongoose.Schema.Types.Decimal128,
    largeSpillProtectiveActionNightDistance: mongoose.Schema.Types.Decimal128,
    version: Number
  });

const Substance = 
  mongoose.model('Substance', substanceSchema);

module.exports = Substance;