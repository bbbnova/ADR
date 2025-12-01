const express = require('express');
const app = express(); 
const Instruction = require('../models/instructionModel');

const getHomePage = async (req, res) => {
    try {
        res.render('home', { title: 'ADR app', layout: 'layouts/main'});
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getListInstructionsPage = async (req, res) => {
    try {
        let instructions = await Instruction.find({}, { _id: 1, number: 1, title: 1, description: 1 }).sort({ number: 1 });
        if (!instructions) {
            instructions = [];
        }
        console.log(instructions);
        res.render('listInstructions', { title: 'ADR app', instructions: instructions, layout: 'layouts/main' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

const getAddInstructionPage = async (req, res) => {
    try {
        res.render('addInstruction', { 
            title: 'ADR app', 
            layout: 'layouts/main' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getEditInstructionPage = async (req, res) => {
    try {
        let instruction = await Instruction.findOne({_id: req.params.id });
            
        res.render('editInstruction', { 
            title: 'ADR app', 
            instruction: instruction, 
            layout: 'layouts/main' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getShowInstructionPage = async (req, res) => {
    try {
        let instruction = await Instruction.findOne({_id: req.params.id });
            
        res.render('showInstruction', { 
            title: 'ADR app', 
            instruction: instruction, 
            layout: 'layouts/main' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getHomePage,
    getListInstructionsPage,
    getAddInstructionPage,
    getEditInstructionPage,
    getShowInstructionPage
}