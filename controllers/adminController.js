const Instruction = require('../models/instructionModel');
const Substance = require('../models/substanceModel');

const getDashboardPage = async (req, res) => {
    try {
        res.render('dashboard', { title: 'ADMIN', layout: 'layouts/admin'});
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getDataPage = async (req, res) => {
    try {   
        const substances = await Substance.find({});
        const instructions = await Instruction.find({});
        // console.log(substances)
        res.render('exportData', { 
            title: 'ADMIN', 
            layout: 'layouts/admin', 
            substances: btoa(encodeURI(JSON.stringify(substances))),
            instructions: btoa(encodeURI(JSON.stringify(instructions)))
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}



module.exports = {
    getDashboardPage,
    getDataPage
};