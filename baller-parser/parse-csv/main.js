const fetch = require('/opt/fetch')

let SHEET_CONFIG = process.env.SHEET_CONFIG; 

exports.parseCSV = async (event, context) => {

    var configSheet = Buffer.from(SHEET_CONFIG, 'base64').toString("utf8");
    configSheet = JSON.parse(configSheet);

    const msg = "hello from json parser"
    return msg
};
