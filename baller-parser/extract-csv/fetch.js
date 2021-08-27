const fetch = require('node-fetch');

exports.extractCSV = async (id, sheet) => {
    //return fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheet}`);
    return "Hello from csv"
};
