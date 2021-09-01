const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const {parseGame} = require('./handlers/parse-game.js')
const {parseLeaders} = require('./handlers/parse-leaders.js')

let SHEET_CONFIG = process.env.SHEET_CONFIG; 

exports.extractAndParseCSV = () => {

    const configSheet = Buffer.from(SHEET_CONFIG, 'base64').toString("utf8");
    const {id, sheets, leaders} = JSON.parse(configSheet);

    var teamID = 0;

    sheets.forEach( async (sheet) => {

        const gameData = await parseGame(id, sheet);

        try {
            await s3.putObject({
                Bucket: "baller-stats-data/json",
                Key: `team-${teamID}.json`,
                Body: JSON.stringify(gameData),
                ContentType: "application/json",
            }).promise();
        } catch (error) {
            console.log(error);
            return;
        }
        teamID++;
    });

    parseLeaders(id, leaders).then(async ({leagueLeaders, teamList}) => {
        try {

            await s3.putObject({
                Bucket: "baller-stats-data/json",
                Key: "leaders.json",
                Body: JSON.stringify(leagueLeaders),
                ContentType: "application/json",
            }).promise();

            await s3.putObject({
                Bucket: "baller-stats-data/json",
                Key: "teams.json",
                Body: JSON.stringify(teamList),
                ContentType: "application/json",
            }).promise();

        } catch (error) {
            console.log(error);
            return;
        }
    });

    return "Uploaded to S3"
};