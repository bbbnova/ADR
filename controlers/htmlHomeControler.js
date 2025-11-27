const express = require('express');
const app = express(); 
const User = require('../models/instructionModel');

const getHomePage = async (req, res) => {
    try {
        res.render('home', { title: 'ADR app', layout: 'layouts/main' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getAddInstructionPage = async (req, res) => {
    try {
        res.render('addInstruction', { title: 'ADR app', layout: 'layouts/editor' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}


module.exports = {
    getHomePage,
    getAddInstructionPage
}