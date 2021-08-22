import arg from 'arg'
import { parseCSV } from './main'

const initArgs = (rawArgs) => {

    const args = arg(
        {
            "--ignore": Number,
            "-i": "--ignore",
            "--file": String,
            "-f": "--file",
            "--dev": Boolean,
            "-d": "--dev"
        },
        {
            argv: rawArgs.slice(2)
        }
    )

    if (!args['--file']) throw new Error('missing required argument: --file');

    return {
        ignore: args['--ignore'] || 1,
        file: args['--file'],
        dev: args['--dev'] || false
    };
}

export function cli(args) {
    let options = initArgs(args)
    parseCSV(options)
}