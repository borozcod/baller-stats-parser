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

    sheets.forEach(async (sheet) => {
        await fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheet}`)
        .then(res => {
            res.body.pipe(csv({
                mapHeaders: ({ header }) => header.toLowerCase().replace(/ /g,"-").replace(/%/g,""),
                row: true
            }))
            .on('data', (data) => {

                if(data['game']) {
                    if(data['game'].toLowerCase() == "totals" || data['game'].toLowerCase() == "team name") {
                        return
                    }
    
                    if(!data['game']) {
                        data['game'] = gameWeek
                    } else {
                        gameWeek = data['game'] 
                    }
                }

                // Update percentage
                _.forEach(data, function(value, key) {
                    if(value.indexOf("%") > -1) {
                        const wholePercent = parseInt(value.replace(/%/g,""))
                        data[key] = wholePercent/100
                        data[`${key}-percent`] = wholePercent
                    }
                });
                const cleanData = _.pickBy(data, (key,val) => key);
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
