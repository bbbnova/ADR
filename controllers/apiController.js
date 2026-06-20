const Instruction = require('../models/instructionModel');
const Substance = require('../models/substanceModel');
const User = require('../models/userModel');
const secretModule = require('../secretModule');
const fs = require('fs');
const path = require('path');

const loginUser = async (req, res) => {
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

const logoutUser = async (req, res) => {
    res.clearCookie("adr_data");
    res.redirect('/');
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

const getSubstanceByNameOrUnNumber = async (req, res) => {
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

const getInstructionById = async (req, res) => {
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
    } catch (error) {
        res.sendStatus(500)
    }
}

const updateInstructionById = async (req, res) => {

    try{
        let result = await Instruction.updateOne(
            {_id: req.body._id}, 
            { 
                $set: 
                {
                    title: req.body.title,
                    description: req.body.description,
                    number: req.body.number,
                    content: req.body.content,
                    version: 1
                }
            }) 

              
        if(result.acknowledged){
            let instruction = 
                await Instruction.findOne({_id: req.body._id});
                
            res.status(200).json(instruction);
        } else {
            console.log('error');
            res.sendStatus(500);
        }
    } catch(err) {
        console.log(err)
    }
}

const updateSubstanceById = async (req, res) => {
    try{
        let instruction = await Instruction.findOne({number: req.body.instructionNumber});

        if(!instruction) {
            console.log(`Instruction number ${req.body.instructionNumber} not found.`);
            res.sendStatus(500);
            return;
        }

        let result = await Substance.updateOne(
            {_id: req.body._id}, 
            { 
                $set: 
                { 
                    instruction: instruction._id,
                    unNumber: req.body.unNumber,
                    nameBg: req.body.nameBg,
                    nameEn: req.body.nameEn,
                    description: req.body.description,
                    hazardClass: req.body.hazardClass,
                    hazardSubclass: req.body.hazardSubclass,
                    dangerNumber: req.body.dangerNumber,
                    isToxic: req.body.isToxic,
                    reactsWithWater: req.body.reactsWithWater,
                    reactionProduct: req.body.reactionProduct,
                    polimerization: req.body.polimerization,
                    smallSpillInitialIsolationDistance: req.body.smallSpillInitialIsolationDistance,
                    smallSpillProtectiveActionDayDistance: req.body.smallSpillProtectiveActionDayDistance,
                    smallSpillProtectiveActionNightDistance: req.body.smallSpillProtectiveActionNightDistance,
                    largeSpillInitialIsolationDistance: req.body.largeSpillInitialIsolationDistance,
                    largeSpillProtectiveActionDayDistance: req.body.largeSpillProtectiveActionDayDistance,
                    largeSpillProtectiveActionNightDistance: req.body.largeSpillProtectiveActionNightDistance,                    
                    version: 1 
                }
            }) 

        console.log(result);  
        if(result.acknowledged){
            let substance = 
                await Substance.findOne({_id: req.body._id});
                
            res.status(200).json(substance);
        } else {
            console.log('error');
            res.sendStatus(500);
        }
    } catch(err) {
        console.log(err)
    }
}

const deleteSubstance = async (req, res) => {
    try {
        let result = await Substance.deleteOne({_id: req.body._id});
        if(result.acknowledged) {
            if(result.deletedCount === 0) {
                return res.status(404).send('Substance not found');
            }
            res.sendStatus(200);
        } else {
            console.log(result);
        }
    } catch(error) {
        res.sendStatus(500);
        console.log(error);
    }
}

module.exports = {
    loginUser,
    logoutUser,
    addUser,
    createUser,
    updateUserPassword,
    toggleUserEnabled,
    getSubstanceByNameOrUnNumber,
    getInstructionById,
    addInstruction,
    updateInstructionById,
    updateSubstanceById,
    deleteSubstance,
    savePlateMap
}

function savePlateMap(req, res) {
    try {
        const data = req.body;
        if (!data || !data.instructions || !data.singlePlate || !Array.isArray(data.combinations)) {
            return res.status(400).json({ error: 'Invalid data structure' });
        }
        const filePath = path.join(__dirname, '../public/modules/plateInstructions.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Could not save file: ' + error.message });
    }
}

async function createUser(req, res) {
    try {
        const { name, password, role } = req.body;
        if (!name || !name.trim() || !password || password.length < 6) {
            return res.status(400).json({ error: 'Попълнете всички полета. Паролата трябва да е поне 6 символа.' });
        }
        const existing = await User.findOne({ name: name.trim() });
        if (existing) {
            return res.status(409).json({ error: 'Потребител с това име вече съществува.' });
        }
        const passwordHash = secretModule.getHash(password, 11);
        const newUser = new User({
            name: name.trim(),
            passwordHash,
            role: ['admin', 'editor', 'viewer'].includes(role) ? role : 'viewer',
            isEnabled: true
        });
        await newUser.save();
        res.json({ success: true, id: newUser._id, name: newUser.name, role: newUser.role });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

async function updateUserPassword(req, res) {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Паролата трябва да е поне 6 символа.' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Потребителят не е намерен.' });
        user.passwordHash = secretModule.getHash(password, 11);
        user.modifiedAt = new Date();
        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

async function toggleUserEnabled(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Потребителят не е намерен.' });
        user.isEnabled = !user.isEnabled;
        user.modifiedAt = new Date();
        await user.save();
        res.json({ success: true, isEnabled: user.isEnabled });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}