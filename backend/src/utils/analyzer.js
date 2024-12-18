// Copie de votre analyzer.js actuel
const { extractSalesData, extractProfileData } = require('../../src/analyzer');

class Analyzer {
    static analyze(text) {
        return {
            sales: extractSalesData(text),
            profile: extractProfileData(text)
        };
    }
}

module.exports = Analyzer;
