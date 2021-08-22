import chalk from 'chalk'
import fs from 'fs'
import csv  from 'csv-parser'
import _ from 'lodash'
import ora from 'ora';

export const parseCSV = async ({dev, ignore, file}) => {

    const spinner = ora({
        text: "Parsing CSV",
        spinner: "material"
    });

    var gameWeek
    const gameData = []

    spinner.start()
    await new Promise(r => setTimeout(r, 1000));
    const stram = fs.createReadStream(file)
    .pipe(csv({
        mapHeaders: ({ header }) => header.toLowerCase().replace(/ /g,"-").replace(/%/g,""),
        row: true
    }))
    .on('data', (data) => {

        if(data['game'].toLowerCase() == "totals") {
            stram.destroy()
            return
        }

        if(!data['game']) {
            data['game'] = gameWeek
        } else {
            gameWeek = data['game'] 
        }

        // Update percentage
        _.forEach(data, function(value, key) {
            if(value.indexOf("%") > -1) {
                const wholePercent = parseInt(value.replace(/%/g,""))
                data[key] = wholePercent/100
                data[`${key}-percent`] = wholePercent
            }
        });

        gameData.push(JSON.stringify(data))
    })
    .on('close', () => {
        spinner.stop()
        if(dev) {
            console.log(gameData[1])
        } else {
            process.stdout.write(JSON.stringify(gameData))
        }
    });
}