const Instruction = require('../models/instructionModel');
const Substance = require('../models/substanceModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

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

const addUser = async (req, res) => {
    try {
        const { name, password, role } = req.body;
        let passwordHash = await bcrypt.hash(password, 11);
        
        const newUser = new User({ name, passwordHash, role });
        await newUser.save();
        console.log('user created: ', newUser);
        res.status(201).send('User added successfully');
    } catch (error) {
        res.status(500).send('Server Error');
    }
}


module.exports = {
    getDashboardPage,
    getDataPage,
    addUser
};