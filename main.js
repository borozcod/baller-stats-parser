const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const csv = require('csv-parser')
const _ = require('lodash');
const s3 = new AWS.S3();

let SHEET_CONFIG = process.env.SHEET_CONFIG; 

exports.extractAndParseCSV = () => {

    var configSheet = Buffer.from(SHEET_CONFIG, 'base64').toString("utf8");

    const {id, sheets} = JSON.parse(configSheet);
    const gameData = []
    var game = ""

    sheets.forEach(async (sheet) => {
        await fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheet}`)
        .then(res => {
            res.body.pipe(csv({
                mapHeaders: ({ header }) => header.toLowerCase().replace(/ /g,"-"),
                row: true
            }))
            .on('data', (csvData) => {
                const data = csvData

                // Update percentage
                _.forEach(data, function(value, key) {
                    if(value.indexOf("%") > -1) {
                        const wholePercent = parseInt(value.replace(/%/g,""))
                        // data[key] = wholePercent/100
                        data[`${key}-percent`] = wholePercent/100
                    }
                });

                const cleanData = _.pickBy(data, (val,key) => !key == "");

                // Spreadsheet only has the game value in the first row of the set
                if(cleanData.hasOwnProperty('game')) {
                    if(cleanData['game'] !== ""){
                        game = cleanData['game']
                    } else {
                        cleanData['game'] = game
                    }
                }
                gameData.push(cleanData)
            })
            .on('close', async () => {
                try {
                    const filename = sheet.toLowerCase().replace(/ /g,"-")
                    const destparams = {
                        Bucket: "baller-stats-data/json",
                        Key: `${filename}.json`,
                        Body: JSON.stringify(gameData),
                        ContentType: "application/json",
                    };

                    const putResult = await s3.putObject(destparams).promise();
                } catch (error) {
                    console.log(error);
                    return;
                }
            });
        });
    })

    return "Uploaded to S3"
};
