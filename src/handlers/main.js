/**
 * A Lambda function that returns a static string
 */
exports.extractAndParseCSV = async () => {
    // If you change this message, you will need to change hello-from-lambda.test.js
    const message = 'Hello from Lambda!';

    // All log statements are written to CloudWatch
    console.info(`${sheets['id']}`);

    return message;
}


//https://docs.google.com/spreadsheets/d/1JL8_O126IPyrY2mdd1cEmdwYrdi9jKXGOKR7JgRJv_U/gviz/tq?tqx=out:csv&sheet=Team%201
