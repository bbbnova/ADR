const mongoose = require('mongoose');

const instructionSchema = new mongoose.Schema({
    instructionId: String,
    number: String,
    title: String,
    description: String,
    content: String,
    version: Number
  });

const Instruction = 
  mongoose.model('Instruction', instructionSchema);

module.exports = Instruction;