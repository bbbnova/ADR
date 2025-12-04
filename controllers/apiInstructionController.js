const Instruction = require('../models/instructionModel');

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

const updateInstruction = async (req, res) => {

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

module.exports = { 
    addInstruction,
    updateInstruction
}