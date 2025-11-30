const express = require('express');
const app = express(); 
const Instruction = require('../models/instructionModel');

const getHomePage = async (req, res) => {
    try {
        res.render('home', { title: 'ADR app', layout: 'layouts/main' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getAddInstructionPage = async (req, res) => {
    try {
        res.render('addInstruction', { 
            title: 'ADR app', 
            layout: 'layouts/editor' });
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
            layout: 'layouts/editor' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getShowInstructionPage = async (req, res) => {
    try {
        let instruction = await Instruction.findOne({_id: req.params.id });
            
        res.render('showInstruction', { 
            title: 'ADR app', 
            content: instruction.content, 
            layout: 'layouts/editor' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getHomePage,
    getAddInstructionPage,
    getEditInstructionPage,
    getShowInstructionPage
}