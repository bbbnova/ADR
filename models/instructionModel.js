const mongoose = require('mongoose');

const instructionSchema = new mongoose.Schema({
    instructionId: String,
    namber: Number,
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    version: Number
  });

const Instruction = mongoose.model('Instruction', instructionSchema);
module.exports = Instruction;