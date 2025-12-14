const Instruction = require('../models/instructionModel');
const Substance = require('../models/substanceModel');

const getHomePage = async (req, res) => {
    try {
        let substances = await Substance.find({}).limit(30).populate("instruction");
        res.render('home', { 
            title: 'Search hazardous materials', 
            layout: 'layouts/main',
            substances: btoa(encodeURI(JSON.stringify(substances)))
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

const getSubstance = async (req, res) => {
    try {
        let substances = await Substance.find(
            {
                $or: [{unNumber: req.params.text.toString()}, {nameBg: {$regex : req.params.text}}]
            }
        );
        
        res.status(200).json(substances);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    getHomePage,
    getSubstance
}