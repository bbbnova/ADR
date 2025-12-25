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

const getLoginPage = async (req, res) => {
    try {
        
        res.render('login', { 
            title: 'Login', 
            layout: 'layouts/main'
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie("adr_data");
    res.redirect('/');
}

const getSubstance = async (req, res) => {
    try {
        
        let substances = await Substance.find(
            {
                $or: [{unNumber: req.params.text.toString()}, 
                    {nameBg: {$regex : req.params.text, $options: 'i'}}]
            }
        );
        
        substances = btoa(encodeURI(JSON.stringify(substances)));
        res.status(200).json({substances: substances});
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

const getInstruction = async (req, res) => {
    try {        
        let instruction = await Instruction.findOne(
            {
                _id: req.params.text.toString()
            }
        );
        res.status(200).json(instruction);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    getHomePage,
    logoutUser,
    getLoginPage,
    getSubstance,
    getInstruction
}