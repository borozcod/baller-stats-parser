const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const {parseGame} = require('./handlers/parse-game.js')
const {parseLeaders} = require('./handlers/parse-leaders.js')

let SHEET_CONFIG = process.env.SHEET_CONFIG; 

exports.extractAndParseCSV = () => {

    const configSheet = Buffer.from(SHEET_CONFIG, 'base64').toString("utf8");
    const {id, sheets, leaders} = JSON.parse(configSheet);

    sheets.forEach( async (sheet) => {

        const gameData = await parseGame(id, sheet);

        try {
            const filename = sheet.toLowerCase().replace(/ /g,"-")
            const putResult = await s3.putObject({
                Bucket: "baller-stats-data/json",
                Key: `${filename}.json`,
                Body: JSON.stringify(gameData),
                ContentType: "application/json",
            }).promise();
        } catch (error) {
            console.log(error);
            return;
        }
    });

    parseLeaders(id, leaders).then(async (leaders) => {
        try {
            const putResult = await s3.putObject({
                Bucket: "baller-stats-data/json",
                Key: "leaders.json",
                Body: JSON.stringify(leaders),
                ContentType: "application/json",
            }).promise();
        } catch (error) {
            console.log(error);
            return;
        }
    });

    return "Uploaded to S3"
};