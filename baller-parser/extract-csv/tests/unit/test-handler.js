'use strict';

const app = require('../../main.js');
const chai = require('chai');
const expect = chai.expect;

describe('Tests index', function () {
    it('verifies successful response', async () => {

        const result = await app.extractCSV();
        const expectedResult = 'hello from csv parser';
        expect(result).to.be.equal(expectedResult);
    });
});