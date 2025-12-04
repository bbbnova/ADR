const Substance = require('../models/substanceModel');

const updateSubstance = async (req, res) => {

    try{
        let result = await Substance.updateOne(
            {_id: req.body._id}, 
            { 
                $set: 
                { 
                    instruction: ObjectId.createFromHexString(req.body.instruction_id),
                    unNumber: req.body.unNumber,
                    nameBg: req.body.nameBg,
                    nameEn: req.body.nameEn,
                    description: req.body.description,
                    polimerization: req.body.polimerization,
                    reactsWithWater: req.body.reactsWithWater,
                    reactionProduct: erq.body.reactionProduct,
                    hazardClass: req.body.hazardClass,
                    hazardSubclass: req.body.hazardSubclass,
                    dangerNumber: req.body.dangerNumber,
                    version: 1
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