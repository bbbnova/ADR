const Substance = require('../models/substanceModel');
const Instruction = require('../models/instructionModel');

const updateSubstance = async (req, res) => {
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
    updateSubstance,
    deleteSubstance
}