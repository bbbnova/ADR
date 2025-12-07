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
                    /*
                    unNumber: unNumber,
                    nameBg: nameBg, 
                    nameEn: nameEn,
                    description: description,
                    hazardClass: hazardClass,
                    hazardSubclass: hazardSubclass,
                    dangerNumber: dangerNumber,
                    isToxic: isToxic,
                    reactsWithWater: reactsWithWater,
                    reactionProduct: reactionProduct,
                    polimerization: polimerization,
                    smallSpillInitialIsolationDistance: smallSpillInitialIsolationDistance,
                    smallSpillProtectiveActionDayDistance: smallSpillProtectiveActionDayDistance,
                    smallSpillProtectiveActionNightDistance: smallSpillProtectiveActionNightDistance,
                    largeSpillInitialIsolationDistance: largeSpillInitialIsolationDistance,
                    largeSpillProtectiveActionDayDistance: largeSpillProtectiveActionDayDistance,
                    largeSpillProtectiveActionNightDistance: largeSpillProtectiveActionNightDistance
                    */
                }
            }) 

              
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

module.exports = {  
    updateSubstance
}