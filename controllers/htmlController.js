const Instruction = require('../models/instructionModel');
const Substance = require('../models/substanceModel');
const ImageCodes = require('../modules/imageCodes');

const getHomePage = async (req, res) => {
    try {
        res.render('home', { 
            title: 'Search hazardous materials', 
            layout: 'layouts/main'
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

const getListSubstancePage = async (req, res) => {
    try {
        let substances = await Substance.find({}).sort({ unNumber: 1 });

        if (!substances) {
            substances = [];
        }        
        res.render('listSubstances', { title: 'ADR app', substances: substances, layout: 'layouts/admin' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}


const getEditSubstancePage = async (req, res) => {
    try {
        let substance = await Substance.findOne({_id: req.params.id }).populate('instruction');
        
        res.render('editSubstance', { 
            title: 'ADR app', 
            substance: substance, 
            layout: 'layouts/admin' });

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

const getShowSubstancePage = async (req, res) => {
    try {
        let substance = await Substance.findOne({_id: req.params.id }).populate('instruction');
        
        if(substance) {
            let imgs = [];
            fillImages(imgs, substance);
            
            res.render('showSubstance', { 
                title: 'ADR app', 
                substance: substance, 
                images: imgs,
                layout: 'layouts/admin' });
        }

    } catch (error) {
        res.status(500).send('Server Error');
    }

    function fillImages(imgs, substance) {
        ImageCodes.forEach(code => {
            if(code.class === substance.hazardClass && code.class.length > 1) {
                imgs.push(code.image)
            }

            if(code.class === substance.hazardClass && code.class.length === 1) {
                if(substance.hazardSubclass.includes(code.subclass)){
                    imgs.push(code.image)
                }
            }
        });
    }
}

const getDeleteSubstancePage = async (req, res) => {
    try {
        let result = await Substance.deleteOne({_id: req.params.id });

        if(result.deletedCount === 0) {
            return res.status(404).send('Substance not found');
        }

        res.redirect('/admin/substancess/');

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getHomePage,
    getLoginPage,
    getDashboardPage,
    getDataPage,
    getListInstructionsPage,
    getAddInstructionPage,
    getEditInstructionPage,
    getShowInstructionPage,
    getDeleteInstructionPage,
    getListSubstancePage,
    getEditSubstancePage,
    getShowSubstancePage,
    getDeleteSubstancePage
}