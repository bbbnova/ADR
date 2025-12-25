const Instruction = require('../models/instructionModel');
const Substance = require('../models/substanceModel');
const User = require('../models/userModel');
const secretModule = require('../secretModule');

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
        let passwordHash = await secretModule.getHash(password, 11);
        const newUser = new User({ name, passwordHash, role });
        await newUser.save();
        res.status(201).send('User added successfully');
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const lognInUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(401).send('Authentication failed');
        }
        const isPasswordValid = await secretModule.verifyHash(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).send('Authentication failed');
        }

        let token = secretModule.encrypt(JSON.stringify({ id: user._id }), process.env.TOKEN_PASSWORD);

        res.cookie('adr_data', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
        res.redirect(req.body.requestedUrl || '/admin');
    } catch (error) {
        res.status(500).send('Server Error');
    }
}


module.exports = {
    getDashboardPage,
    getDataPage,
    addUser,
    lognInUser
};