const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { parseGame } = require('./handlers/parse-game.js')
const { parseLeaders } = require('./handlers/parse-leaders.js')
const { parseTeams } = require('./handlers/parse-teams.js')

let SHEET_CONFIG = process.env.SHEET_CONFIG; 
let TEAM_SHEET = "Teams";

exports.extractAndParseCSV = () => {

    const configSheet = Buffer.from(SHEET_CONFIG, 'base64').toString("utf8");
    const {id, sheets, leaders} = JSON.parse(configSheet);

    sheets.forEach( async (sheet) => {

        const gameData = await parseGame(id, sheet);
        const teamName = sheet.toLowerCase().replace(/ /g,"-");

        try {
            await s3.putObject({
                Bucket: "baller-stats-data/json",
                Key: `${teamName}.json`,
                Body: JSON.stringify(gameData),
                ContentType: "application/json",
            }).promise();
        } catch (error) {
            console.log(error);
            return;
        }
    });

    parseTeams(id, TEAM_SHEET).then(async (teamList) => {
        try {
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
    })

    parseLeaders(id, leaders).then(async (leagueLeaders) => {
        // uncomment for testing
        // process.stdout.write(JSON.stringify(leagueLeaders))
        try {
            await s3.putObject({
                Bucket: "baller-stats-data/json",
                Key: "leaders.json",
                Body: JSON.stringify(leagueLeaders),
                ContentType: "application/json",
            }).promise();
        } catch (error) {
            console.log(error);
            return;
        }
    });

    return "Uploaded to S3"
};