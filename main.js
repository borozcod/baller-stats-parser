const { parseGame } = require('./handlers/parse-game.js')
const { parseLeaders } = require('./handlers/parse-leaders.js')
const { parseTeams } = require('./handlers/parse-teams.js')
const fs = require('fs')

let SHEET_CONFIG = process.env.SHEET_CONFIG; 
let TEAM_SHEET = "Teams";

exports.extractAndParseCSV = () => {
    const configSheet = Buffer.from(SHEET_CONFIG, 'base64').toString("utf8");
    const {id, sheets, leaders} = JSON.parse(configSheet);

    sheets.forEach( async (sheet) => {

        const gameData = await parseGame(id, sheet);
        const teamName = sheet.toLowerCase().replace(/ /g,"-");

        fs.writeFileSync(`${__dirname}/export/${teamName}.json`, JSON.stringify(gameData));
    });

    parseTeams(id, TEAM_SHEET).then(async (teamList) => {
        fs.writeFileSync(`${__dirname}/export/teams.json`, JSON.stringify(teamList));
    })

    parseLeaders(id, leaders).then(async (leagueLeaders) => {
        fs.writeFileSync(`${__dirname}/export/leaders.json`, JSON.stringify(leagueLeaders));
    });

    return "Done"
};
