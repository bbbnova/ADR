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
                        
                        substances.push(newSubstance);
                    } else {
                        console.log(`No instruction found for number: ${row.values[2]}, unNumber: ${row.values[1]}`);
                    }
                }
                
            }
            console.log(`Inserting total of ${substances.length} substances`);
            let result = await Substance.insertMany(substances);
            
            res.sendStatus(200);
        });

    } catch (error) {
        res.sendStatus(500)
    }
}

const readDistances = async (req, res) => {
    try {
        var workbook = new Excel.Workbook();

        workbook.xlsx.readFile('../../Info/directory.xlsx').then(async function() {
            var worksheet = workbook.getWorksheet(2);
            let i = 1;
            let subs = "";
            for(i=1; i<=622; i++){
                let row = worksheet.getRow(i);
                let substances = await Substance.find({ unNumber: row.values[1]});
                
                for(let substance of substances){
                    if(substance){
                        substance.isToxic = true;
                        substance.smallSpillInitialIsolationDistance = getDistanceInMeters(row.values[3]);
                        substance.smallSpillProtectiveActionDayDistance = getDistanceInMeters(row.values[5]);
                        substance.smallSpillProtectiveActionNightDistance = getDistanceInMeters(row.values[7]);
                        substance.largeSpillInitialIsolationDistance = getDistanceInMeters(row.values[9]);
                        substance.largeSpillProtectiveActionDayDistance = getDistanceInMeters(row.values[11]);
                        substance.largeSpillProtectiveActionNightDistance = getDistanceInMeters(row.values[13]);
                        if(await substance.save())
                        {
                            subs += substance.unNumber + " ";
                        }
                        // console.log(`Updated distances for substance UN: ${row.values[1]}`,);
                    } else {
                        console.log(`No substance found for UN: ${row.values[1]}`);
                    }
                }
            }
            // console.log(`subs: ${subs}`);
            console.log(`total: ${subs.split(" ").length}`);
            res.sendStatus(200);
        });

    } catch (error) {
        res.sendStatus(500)
    }
}

function getDistanceInMeters(cellValue){
    if(typeof cellValue === 'undefined' || cellValue === null){
        console.log(`Unknown distance unit: ${arr[1]} for value: ${cellValue}`);
        return null;
    }
    let strValue = cellValue.toString().trim().replace(">", "")/*.replace("<", "")*/.replace("  ", " ");
    let arr = strValue.split(" ");
    let ret;
    // ret = strValue;
    if(arr.length === 1){
        ret = parseFloat(arr[0])* 1000;
    } else {
        if(arr[1] === 'm'){
            ret =  parseInt(arr[0]);
        } else if(arr[1] === 'km'){
            ret = parseFloat(arr[0]) * 1000;
        } else {
            console.log(`Unknown distance unit: ${arr[1]} for value: ${cellValue}`);
            ret = 0;
        }
    }

    return ret;
}

const readWaterReactions = async (req, res) => {
    try {
        var workbook = new Excel.Workbook();

        workbook.xlsx.readFile('../../Info/directory.xlsx').then(async function() {
            var worksheet = workbook.getWorksheet(3);
            let i = 1;
            for(i=1; i<=130; i++){
                let row = worksheet.getRow(i);
                let substances = await Substance.find({ unNumber: row.values[1]});
                for(let substance of substances){
                    if(substance){
                        substance.reactsWithWater = true;
                        // console.log(typeof row.values[4]);
                        if(typeof row.values[4] === 'string'){ 
                            substance.reactionProduct = row.values[4];
                        } else if(typeof row.values[4] === 'object' && row.values[4] !== null) {
                            substance.reactionProduct = JSON.stringify(row.values[4]);
                        }
                        await substance.save();
                        // console.log(`Updated water reaction for substance UN: ${row.values[1]}`,);
                    }
                }
            }
            res.sendStatus(200);
        });

    } catch (error) {
        res.sendStatus(500)
    }
}

const readSubstanceParameters = async (req, res) => {
    try {
        var workbook = new Excel.Workbook();

        workbook.xlsx.readFile('../../Info/inland-transport-of-dangerous-goods-directive--annex-i---adr-export.xlsx').then(async function() {
            var worksheet = workbook.getWorksheet(1);
            let i = 1;
            for(i=6; i<=6147; i++){
                let row = worksheet.getRow(i);
                let substances = await Substance.find({ unNumber: row.values[12]});
                for(let substance of substances){
                    if(substance){
                        substance.nameEn = row.values[1].toString().trim();
                        substance.hazardClass = row.values[6].toString().trim();
                        let classArray = row.values[6].toString().trim().split(".");
                        
                        if(classArray.length > 1) {
                            substance.hazardSubclass = classArray[1];
                        }

                        if(typeof row.values[16] !== 'undefined' && row.values[16] !== null){
                            substance.dangerNumber = row.values[16];
                        }
                        
                        await substance.save(); 
                    }
                }
            }
            res.sendStatus(200);
        });

    } catch (error) {
        res.sendStatus(500)
    }
}

const readSubclasses = async (req, res) => {    //ADR2023_Substances.xlsx
    try {
        var workbook = new Excel.Workbook();

        workbook.xlsx.readFile('../../Info/ADR2023_Substances.xlsx').then(async function() {
            var worksheet = workbook.getWorksheet(1);
            let i = 1;
            for(i=4; i<=2931; i++){
                let row = worksheet.getRow(i);
                let substances = await Substance.find({ unNumber: row.values[2]});
                for(let substance of substances){
                    if(substance){
                        substance.hazardSubclass = row.values[5].toString().trim();                    
                        await substance.save(); 
                    }
                }
            }
            res.sendStatus(200);
        });

    } catch (error) {
        res.sendStatus(500)
    }
}

module.exports = {
    readSubstances,
    readDistances,
    readWaterReactions,
    readSubstanceParameters,
    readSubclasses
}