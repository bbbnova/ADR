const express = require('express');
const app = express(); 
var Excel = require('exceljs');

const readExcel = async (req, res) => {
    try {
        
        var workbook = new Excel.Workbook();

        workbook.xlsx.readFile('../../Info/directory.xlsx')
            .then(function() { 
                var worksheet = workbook.getWorksheet(1);
                // var row = worksheet.getRow(1);
                worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                    console.log(row.values[1], row.values[2], row.values[3]);
                });
                res.sendStatus(200);
            })

         

    } catch (error) {
        res.sendStatus(500)
    }
}

module.exports = { 
    readExcel
}