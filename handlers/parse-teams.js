const fetch = require('node-fetch');
const csv = require('csv-parser')
const _ = require('lodash');

exports.parseTeams = (id, sheet)  => {
    return new Promise( async (resolve, reject) => {

        const teamList = [];

        await fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheet}`)
        .then(res => {
            res.body.pipe(csv({
                mapHeaders: ({ header }) => header.toLowerCase().replace(/ /g,"-"),
                row: true
            }))
            .on('data', (csvData) => {
                const data = _.pickBy(csvData, (val,key) => !key == "");
                const apiUrl = data['team'].toLowerCase().replace(/ /g,"-");
                teamList.push({
                    "team": apiUrl,
                    "name": data['name'],
                })
            })
            .on('close', async () => {
                resolve(teamList);
            });
        });
    })
}