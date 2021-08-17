import arg from 'arg'
import { parseCSV } from './main'

const initArgs = (rawArgs) => {

    const args = arg(
        {
            "--ignore": Number,
            "-i": "--ignore",
            "--file": String,
            "-f": "--file"
        },
        {
            argv: rawArgs.slice(2)
        }
    )

    if (!args['--file']) throw new Error('missing required argument: --file');

    return {
        ignore: args['--ignore'] || 1,
        file: args['--file']
    };
}

export function cli(args) {
    let options = initArgs(args)
    parseCSV(options)
}