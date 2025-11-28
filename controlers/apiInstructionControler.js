const express = require('express');
const app = express(); 
const Instruction = require('../models/instructionModel');

const addInstruction = async (req, res) => {
    try {
        let newInstruction = 
            await Instruction.create({ 
                title: req.body.title, 
                number: req.body.number, 
                description: req.body.description,
                content: req.body.content,
            version: 1 });
        res.status(200).json(newInstruction);
        console.log(newInstruction);
    } catch (error) {
        res.sendStatus(500)
    }
}


module.exports = { 
    addInstruction
}