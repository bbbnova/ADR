const express = require('express');
const app = express(); 
var Excel = require('exceljs');
let Substance = require('../models/substanceModel');
let Instruction = require('../models/instructionModel');


const readSubstances = async (req, res) => {
    try {        
        var workbook = new Excel.Workbook();

        workbook.xlsx.readFile('../../Info/directory.xlsx').then(async function() { 
            var worksheet = workbook.getWorksheet(1);
            // var row = worksheet.getRow(1);
            let i = 1;
            let substances = [];
            
            for(i=1; i<=3300; i++){
                let row = worksheet.getRow(i);
                //console.log(`working on row {$i}: `+ row.values[1], row.values[2], row.values[3]);
                if(typeof row.values[2] === 'undefined' || row.values[2] === null || row.values[2].toString().length < 3){
                    console.log(`Skipping row ${i}, un: ${row.values[1]} due to invalid instruction number: ${row.values[2]}`);
                } else {
                    let instruction  = await Instruction.findOne({ number: row.values[2].toString().substring(0,3)});
                    if(instruction){
                        let polimerization = row.values[2].toString().includes("Р") ? true : false;
                        let newSubstance = { 
                            unNumber: row.values[1],
                            instruction: instruction._id,
                            nameBg: row.values[3],
                            version: 1,
                            polimerization: polimerization
                        }
                        //console.log(`Adding substance for unNumber: ${row.values[1]}, instruction number: ${row.values[2]}`);
                        substances.push(newSubstance);
                    } else {
                        console.log(`No instruction found for number: ${row.values[2]}, unNumber: ${row.values[1]}`);
                    }
                }
                
            }
            console.log(`Inserting total of ${substances.length} substances`);
            let result = await Substance.insertMany(substances);
            // console.log(result);
            res.sendStatus(200);
            
        });

    } catch (error) {
        res.sendStatus(500)
    }
}

module.exports = {
    readSubstances
}