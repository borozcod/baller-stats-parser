import chalk from 'chalk'
import fs from 'fs'
import parse from 'csv-parse'
import _ from 'lodash'
import ora from 'ora';

export const parseCSV = ({ignore, file}) => {
    const parser = parse()
    const spinner = ora({
        text: "Parsing CSV",
        spinner: "material"
    });

    const playerData = []

    const stream = fs.createReadStream(file);
    stream.on('open', function () {
        spinner.start()
        stream.pipe(parser).on('readable', function() {

            let headers = parser.read()
            const headerLabels = _.drop(headers, ignore)

            const labels = []

            _.forEach(headerLabels, function(label) {
                const l = label.toLowerCase().replace(/ /g,"-");
                labels.push(l)
            })


            let record
            while (record = parser.read()) {
                const stats = _.drop(record, ignore)
                var week
                const weekCheck = /\bGame\b/.test(record[0]);

                if(weekCheck) {
                    week = record[0]
                }

                if(stats[0] == ''){
                    stream.destroy()
                }

                const thisPlayer = []

                _.forEach(stats, function(value, i) {
                    thisPlayer.push({
                        property: labels[i],
                        value: value
                    })
                });
                playerData.push([...thisPlayer, {
                    property: "gameweek",
                    value: week
                }])
            }

            //console.log(playerData);
            parser.end()

        })
        .on('close', function (err) {
            spinner.stop()
        });
    });
}