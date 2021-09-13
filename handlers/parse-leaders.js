const fetch = require('node-fetch');
const csv = require('csv-parser')
const _ = require('lodash');

exports.parseLeaders = (id, sheet)  => {
    return new Promise( async (resolve, reject) =>{

        const leagueLeaders = [];

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

                const skip = [''];
                if( !(_.indexOf(skip, data['last']) > -1) ) {
                    leagueLeaders.push(data);
                }
            })
            .on('close', () => {
                resolve(leagueLeaders);
            });
        });
    })
}