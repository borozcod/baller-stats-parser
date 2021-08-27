// Import all functions from hello-from-lambda.js
const lambda = require('../../../src/handlers/main.js');

// This includes all tests for extractAndParseCSV()
describe('Test for hello-from-lambda', function () {
    // This test invokes extractAndParseCSV() and compare the result 
    it('Verifies successful response', async () => {
        // Invoke extractAndParseCSV()
        const result = await lambda.extractAndParseCSV();
        /* 
            The expected result should match the return from your Lambda function.
            e.g. 
            if you change from `const message = 'Hello from Lambda!';` to `const message = 'Hello World!';` in hello-from-lambda.js
            you should change the following line to `const expectedResult = 'Hello World!';`
        */
        const expectedResult = 'Hello from Lambda!';
        // Compare the result with the expected result
        expect(result).toEqual(expectedResult);
    });
});
