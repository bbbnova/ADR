const Instruction = require('../models/instructionModel');



const getListInstructionsPage = async (req, res) => {
    try {
        let instructions = await Instruction.find({}, { _id: 1, number: 1, title: 1, description: 1 }).sort({ number: 1 });
        if (!instructions) {
            instructions = [];
        }        
        res.render('listInstructions', { title: 'ADR app', instructions: instructions, layout: 'layouts/admin' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

const getAddInstructionPage = async (req, res) => {
    try {
        res.render('addInstruction', { 
            title: 'ADR app', 
            layout: 'layouts/admin' });
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
            layout: 'layouts/admin' });

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
            layout: 'layouts/admin' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getDeleteInstructionPage = async (req, res) => {
    try {
        let result = await Instruction.deleteOne({_id: req.params.id });

        if(result.deletedCount === 0) {
            return res.status(404).send('Instruction not found');
        }

        res.redirect('/admin/instructions/');

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = {    
    getListInstructionsPage,
    getAddInstructionPage,
    getEditInstructionPage,
    getShowInstructionPage,
    getDeleteInstructionPage
}