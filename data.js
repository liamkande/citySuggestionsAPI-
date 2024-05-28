const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const cities = [];

const loadCities = new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, 'cities_canada-usa.tsv'))
        .pipe(csv({ separator: '\t' }))
        .on('data', (row) => {
            cities.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            resolve(cities);
        })
        .on('error', (error) => {
            reject(error);
        });
});

module.exports = { cities, loadCities };
