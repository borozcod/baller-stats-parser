const fetch = require('node-fetch');
const csv = require('csv-parser')
const _ = require('lodash');

exports.parseLeaders = (id, sheet)  => {
    return new Promise( async (resolve, reject) =>{

        const leagueLeaders = [];
        const teamListCheck = [];
        const teamList = [];
        var teamID = 0;

        await fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheet}`)
        .then(res => {
            res.body.pipe(csv({
                mapHeaders: ({ header }) => header.toLowerCase().replace(/ /g,"-"),
                row: true
            }))
            .on('data', (csvData) => {

                const data = _.pickBy(csvData, (val,key) => !key == "");

                // Update percentage
                _.forEach(data, function(value, key) {
                    if(value.indexOf("%") > -1) {
                        const wholePercent = parseInt(value.replace(/%/g,""));
                        // data[key] = wholePercent/100
                        data[`${key.replace(/%/g,"")}-percent`] = wholePercent/100;
                    }
                });

                if(!(teamListCheck.indexOf(data["team-name"]) > -1)) {
                    teamListCheck.push(data["team-name"]);
                    teamList.push({
                        name: data["team-name"],
                        id: teamID
                    });
                    teamID++;
                }

                leagueLeaders.push(data)
            })
            .on('close', async () => {
                resolve({
                    "leagueLeaders":  leagueLeaders,
                    "teamList": teamList
                });
            });
        });
    })
}