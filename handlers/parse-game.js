const fetch = require('node-fetch');
const csv = require('csv-parser')
const _ = require('lodash');

exports.parseGame = (id, sheet)  => {
    return new Promise( async (resolve, reject) => {

        var game = ""; // The 'game' column
        var i = -1; // We increment to 0 on the first game

        const gameData = {
            "team": "",
            "events": [],
            "total": {}
        }

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
                        const wholePercent = parseInt(value.replace(/%/g,""))
                        data[`${key.replace(/%/g,"")}-percent`] = wholePercent/100
                    }
                });

                if(_.has(data, 'game')) {
                    // New gameweek
                    if(data['game'] !== "") {

                        game = data['game']
                        i++;

                        if(game.toLocaleLowerCase() === "totals") {
                            gameData["total"] = {
                                "stats": [],
                            }
                        } else if(game.toLocaleLowerCase() === "team name") {
                            gameData["team"] = data['last'];
                        } else if(game.toLocaleLowerCase().toLocaleLowerCase().indexOf("game") > -1) {
                            gameData["events"].push({
                                "name": data['game'],
                                "stats": []
                            });
                        }
                    }
                }

                const skip = ['Last', '', 'Total'];
                const cleanGameData = _.omit(data, 'game');
                const gameCheck = game.toLocaleLowerCase();

                if(!(_.indexOf(skip, data['last']) > -1)) {
                    if(data['last'] === "Total") {
                        gameData["total"]["team_aggregate"] = cleanGameData; // Team total
                    } else if(gameCheck === "totals") {
                        gameData["total"]["stats"].push(cleanGameData); // Individual total
                    } else if(gameCheck.indexOf("game") > -1) {
                        gameData["events"][i]["stats"].push(cleanGameData); // Regular gameweek
                    }
                }
            })
            .on('close', () => {
                resolve(gameData);
            });
        });
    })
}