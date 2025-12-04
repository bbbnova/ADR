const Substance = require('../models/substanceModel');



const getListSubstancePage = async (req, res) => {
    try {
        let substances = await Substance.find({}, { 
            _id: 1, 
            unNumber: 1,
            nameBg: 1,
            dangerNumber: 1
        }).sort({ unNumber: 1 });

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
        let substance = await Substance.findOne({_id: req.params.id });
            
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
        let substance = await Substance.findOne({_id: req.params.id });
            
        res.render('showSubstance', { 
            title: 'ADR app', 
            substance: substance, 
            layout: 'layouts/admin' });

    } catch (error) {
        res.status(500).send('Server Error');
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
    getListSubstancePage,
    getEditSubstancePage,
    getShowSubstancePage,
    getDeleteSubstancePage
}