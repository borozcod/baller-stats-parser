'use strict';

const app = require('../../main.js');
const chai = require('chai');
const expect = chai.expect;

describe('Tests index', function () {
    it('verifies successful response', async () => {

        const result = await app.parseCSV();
        const expectedResult = 'hello from json parser';
        expect(result).to.be.equal(expectedResult);
    });
});